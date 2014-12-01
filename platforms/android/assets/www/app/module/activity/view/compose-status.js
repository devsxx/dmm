define([
    'activity/view/compose-attachment',
    'activity/view/privacy-holder',
    'core',
    'text!activity/tpl/compose-status-form.html',
    'text!activity/tpl/compose-status.html'
], function(ComposeAttachment, PrivacyHolder, core, textForm, text) {

    return Backbone.View.extend({
        initialize: function() {
            utils.observer.on('attachment:success', this.handleAttachSucess, this);
            this.attachment = {
                type: 'text'
            };
        },
        events: {
            'click #activity_status_post_btn': 'post',
            'click #remove_attachment_btn': 'removeAttachment', // the close button are generated from attachment view, not this view
            'keyup #activiy_status_compose_text': 'onKeyup',
            'input #activiy_status_compose_text': 'onKeyup',
            'paste #activiy_status_compose_text': 'onKeyup',
            // 'focus #activiy_status_compose_text': function(e) { alert('abc')},
        },
        region: {
            main: '#main',
            content: '#content'
        },
        template: _.template(text),
        templateForm: _.template(textForm),
        render: function(context) {

            this.context = $.extend({
                sItemType: 'user',
                iItemId: core.viewer.getId(),
                trigger: ''
            }, context);

            this.$el.html(this.template(this.context));

            this.$postBtn = $('#activity_status_post_btn', this.$el);
            this.$form_holder = $('#status_form_holder', this.$el);

            return this;
        },
        inject: function() {

            $(this.region.main).html(this.$el);

            this.$scroller = this.$el.find('#content');

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {

            utils.api.get('feed/formstatus', {}, {
                context: this
            }).done(this.fetchDataDone).fail(this.fetchDataFail);
        },
        fetchDataDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.formData = data;
            this.updateView();
        },
        fetchDataFail: function(jqXHR, textStatus, errorThrown) {

            utils.debug.log(arguments);
            utils.modal.alert(_t('Can not load data from server'));
            utils.history.back();
        },
        updateView: function() {

            this.$form_holder.html(this.templateForm(this.context));

            this.$text = this.$el.find('#activiy_status_compose_text');
            this.$attachmentHolder = this.$el.find('#compose_status_attachment_holder');
            this.$attachmentPickerHolder = this.$el.find('#compose_status_select_attachment_holder');

            this.$postBtn.removeClass('hide');

            // attachment view
            var exclude = this.formData.bCanUploadVideo ? [] : ['video'];

            if (this.context.sItemType === 'event' || this.context.sItemType === 'fevent' || this.context.sItemType === 'pages') {
                exclude.push('checkin');
            }

            this.composeAttachment = new ComposeAttachment().render({
                exclude: exclude
            }).inject();

            this.$attachmentPickerHolder.removeClass('hide');

            this.applyTrigger();

            // privacy view
            this.privacyView = new PrivacyHolder().render().inject();
            if (this.context.sItemType === 'event' || this.context.sItemType === 'fevent') {
                this.privacyView.$el.addClass('hide');
            }
        },

        /**
         * @param {} data
         *      html -> html of generated attachment
         *      data -> data related to each type
         *      type
         */
        handleAttachSucess: function(data) {
            this.$attachmentHolder.html(data.html);
            this.attachment.data = data.data;
            this.attachment.type = data.type;
        },

        removeAttachment: function() {
            this.$attachmentHolder.html('');
            this.attachment = {
                type: 'text'
            };
            utils.observer.trigger('attachment:remove');
        },

        post: function() {
            if (this.$postBtn.hasClass('processing')) {
                return false;
            }

            if (!this.isPostValidated()) {
                return false;
            }

            var data = {
                'sContent': this.$text.val(),
                'iSubjectId': this.context.iItemId,
                'sSubjectType': this.context.sItemType,
                'iPrivacy': this.privacyView.getChosenValue()
            };
            var settings = {
                'context': this,
                'beforeSend': this.beforeSend
            };

            switch (this.attachment.type) {
                case 'link':
                    this.postStatusWithLink(data, settings);
                    break;

                case 'video':
                    this.postStatusWithVideo(data, settings);
                    break;

                case 'photo':
                    this.postStatusWithPhoto(data, settings);
                    break;

                case 'checkin':
                    this.postStatusWithCheckin(data, settings);
                    break;

                default:
                    utils.api.post('feed/post', data, settings).done(this.postDone).always(this.postComplete);
                    break;
            }
        },

        postStatusWithPhoto: function(data, settings) {
            var self = this,
                path = this.attachment.data.sImgSrc

            var params = $.extend(data, {
                isPostStatus: true,
                sStatusInfo: data.sContent,
                sSubjectType: data.sSubjectType,
                iSubjectId: data.iSubjectId

            });

            utils.api.uploadImage('photo/upload', path, params).done(function(result) {
                self.postSuccess(result);
            }).fail(this.hanleUploadPhotoFail);
        },

        hanleUploadPhotoFail: function(error) {
            utils.modal.alert('Can not upload file(s). Please try again later.');
            utils.debug.error('Error upload file :' + JSON.stringify(error));
        },

        postStatusWithLink: function(data, settings) {
            // depend on our knowledgeo the attachment trigger on sucess attach
            data['aAttachment'] = {
                'uri': this.attachment.data.sLink,
                'title': this.attachment.data.sTitle,
                'description': this.attachment.data.sDescription,
                'thumb': this.attachment.data.sDefaultImage,
                'type': 'link'
            };
            utils.api.post('feed/post', data, settings).done(this.postDone).always(this.postComplete);
        },

        postStatusWithVideo: function(data, settings) {

            var postData = $.extend(data, {
                sTitle: this.attachment.data.sTitle
            });

            var self = this;
            utils.api.uploadVideo('video/upload', this.attachment.data.fileURI, postData).done(function(response) {
                self.postConvertVideo(response.iVideoId);
                self.postDone(response);
            });
        },

        postConvertVideo: function(iVideoId) {

            var postData = {
                iVideoId: iVideoId,
                iInline: 1
            };
            var settings = {
                timeout: 0
            }

            utils.api.post('video/convert', postData, settings); // ignore result
        },

        postStatusWithCheckin: function(data, settings) {
            data.sLocation = this.attachment.data.name;
            data.fLatitude = this.attachment.data.latitude;
            data.fLongitude = this.attachment.data.longitude;
            data.iUserId = data.iSubjectId;
            data.sStatus = data.sContent;

            utils.api.post('user/checkin', data, settings).done(this.postDone).always(this.postComplete);

        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.$postBtn.removeClass('processing');
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$postBtn.addClass('processing');
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server.'));
            }

            this.postSuccess(data);
        },

        isPostValidated: function() {
            if (this.$text.val().trim() === '') {
                utils.modal.alert('Please enter your message');
                return false;
            }
            return true;
        },

        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function(data) {

            utils.modal.toast(data.message || _t('Post status successfully'));
            window.history.back();
        },

        applyTrigger: function() {

            switch (this.context.trigger) {
                case 'camera':
                    this.composeAttachment.addFromCamera();
                    break;
                case 'checkin':
                    this.composeAttachment.addCheckin();
                    break;
            }
        },

        onKeyup: function(e) {
            var bDisable = (this.$text.val().trim() == '');
            if (bDisable) {
                this.$postBtn.addClass('disabled');
            } else {
                this.$postBtn.removeClass('disabled');
            }
        }
    });
});