define([
    'video/model/video',
    'text!video/tpl/video-add-form.html',
    'text!video/tpl/video-add.html'
], function(Model, formText, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            form_holder: '#video_add_form'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        render: function() {

            this.$el.html(this.template());

            this.$form_holder = this.$el.find(this.region.form_holder);
            this.$save_btn = this.$el.find('#save_btn');

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {

            utils.api.get('video/formadd', {}, {
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

            this.$form_holder.html(this.formTemplate({
                data: this.formData || {}
            }));

            this.$form_title = this.$el.find('#video_form_title');
            this.$form_description = this.$el.find('#video_form_description');
            this.$form_category = this.$el.find('#video_form_category');
            this.$form_privacy = this.$el.find('#video_form_privacy');
            this.$form_privacy_comment = this.$el.find('#video_form_privacy_comment');
            this.$form_type = this.$el.find('#video_form_type');
            this.$form_url = this.$el.find('#video_form_url');
            this.$form_file_path = this.$el.find('#video_form_file_path');
            this.$form_file_preview = this.$el.find('#video_form_file_preview');

            var self = this;
            this.$el.find('input').bind('input propertychange', function() {
                self.toggleSaveBtn();
            });
        },
        events: {
            'change #video_form_type': 'onChangeVideoType',
            'click #remove_file_btn': 'resetSource',
            'click #save_btn': 'onSaveClick'
        },
        onChangeVideoType: function(evt) {

            if (!this.$form_type.val()) {
                return this.resetSource();
            }

            if (this.$form_type.val() == 'file') {
                this.onChangeTypeToFile();
            } else {
                this.onChangeTypeToURL();
            }
        },
        onChangeTypeToFile: function() {

            var self = this;

            var onSuccess = function(fileURI) {
                self.onGetVideoSuccess(fileURI);
            };

            var onFail = function(msg) {
                self.onGetVideoFail(msg);
            };

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.VIDEO
            });
        },
        onChangeTypeToURL: function() {

            this.$form_file_path.val('');
            this.$form_file_preview.addClass('hide');
            this.$form_url.val('').removeClass('hide');

            this.toggleSaveBtn();
        },
        onGetVideoSuccess: function(fileURI) {

            this.$form_url.val('').addClass('hide');
            this.$form_file_path.val(fileURI);
            this.$form_file_preview.removeClass('hide');

            this.toggleSaveBtn();
        },
        onGetVideoFail: function(msg) {

            utils.debug.log(msg);
            this.resetSource();
        },
        resetSource: function(evt) {

            this.$form_type.val('');
            this.$form_url.val('').addClass('hide');
            this.$form_file_path.val('');
            this.$form_file_preview.addClass('hide');

            this.toggleSaveBtn();
        },
        onSaveClick: function(evt) {

            if (this.$save_btn.hasClass('processing')) {
                return;
            }

            // validate
            if (!this.$form_title.val().trim()) {
                return utils.modal.alert(_t('Video title is required.'));
            }

            if (!this.$form_url.val() && !this.$form_file_path.val()) {
                return utils.modal.alert(_t('Please select video to upload.'));
            }

            // passed
            if (this.$form_type.val() == 'file') {
                this.uploadVideo();
            } else {
                this.saveVideo();
            }
        },
        uploadVideo: function() {

            var postData = {
                sTitle: this.$form_title.val(),
                sDescription: this.$form_description.val(),
                iCategoryId: this.$form_category.val() || 0,
                iPrivacy: this.$form_privacy.val() || 0,
                iPrivacyComment: this.$form_privacy_comment.val() || 0
            };

            var self = this;
            utils.api.uploadVideo('video/upload', this.$form_file_path.val(), postData).done(function(data) {
                self.postConvertVideo(data.iVideoId);
                self.saveDone(data);
            });
        },
        postConvertVideo: function(iVideoId) {

            var postData = {
                iVideoId: iVideoId
            };
            var settings = {
                timeout: 0
            }

            utils.api.post('video/convert', postData, settings); // ignore result
        },
        saveVideo: function() {

            var postData = {
                title: this.$form_title.val(),
                description: this.$form_description.val(),
                category_id: this.$form_category.val() || 0,
                auth_view: this.$form_privacy.val() || 0,
                auth_comment: this.$form_privacy_comment.val() || 0,
                sUrl: this.$form_url.val()
            };

            var settings = {
                context: this
            };

            this.$save_btn.addClass('processing');

            utils.api.post('video/create', postData, settings).done(this.saveDone).always(function() {
                this.$save_btn.removeClass('processing');
            });
        },
        saveDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            if (data.message) {
                utils.modal.toast(data.message);
            }

            var item = new Model(data);
            window.location.href = item.getUrl();
        },
        toggleSaveBtn: function(evt) {

            var bDisable = !this.$form_title.val().trim() || (!this.$form_url.val() && !this.$form_file_path.val());

            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});