define([
    'attachment/model/attachment-photo',
    'photo/view/photo-add-actions',
    'poll/model/perms',
    'poll/view/poll-add-photo-item',
    'text!poll/tpl/poll-add-form-answer.html',
    'text!poll/tpl/poll-edit-form.html',
    'text!poll/tpl/poll-edit.html'
], function(AttachmentPhotoModel, PhotoAddActionsView, PermsModel, AttachmentAddPhotoItem, formAnswerTpl, formText, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            form_holder: '#poll-edit'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        formAnswerTpl: _.template(formAnswerTpl),
        render: function(context) {

            this.context = $.extend({}, context);

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                context: this.context
            }));

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

            var postData = {
                iPollId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('poll/formedit', postData, settings).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.perms = new PermsModel(data.perms);
            if (!this.perms.canEditPoll()) {
                utils.modal.alert(_t('Your user group lacks permissions to edit that poll.'));
                return utils.history.back();
            }

            this.formData = data;
            this.model.set(data.detail);
            this.updateView();
        },
        updateView: function() {

            this.$form_holder.html(this.formTemplate({
                data: this.formData,
                item: this.model,
                perms: this.perms
            }));

            this.$attachment_photo_holder = this.$el.find('#attachment_photo_holder');
            this.$form_content = this.$el.find('#poll_add_form_content');
            this.$form_hide_vote = this.$el.find('#poll_form_hide_vote');
            this.$form_privacy = this.$el.find('#poll_form_privacy');
            this.$form_privacy_comment = this.$el.find('#poll_form_privacy_comment');
            this.$form_question = this.$el.find('#poll_form_question');
            this.$photo_add_btn = this.$el.find('#photo_add_btn');

            if (this.model.hasImage()) {
                this.getPictureSuccess(this.model.getImageSrc(), true);
            }
        },
        fetchDataFail: function() {

            utils.debug.log(arguments);
            utils.history.back();
        },
        events: {
            'click #photo_add_btn': 'onAddPhotoClick',
            'click #save_btn': 'onSaveClick',
            'click .icon-answer-minus': 'removeAnswer',
            'click .icon-answer-plus': 'addAnswer',
            'keyup #poll_form_title': 'toggleSaveBtn',
            'keyup .poll-form-answer': 'toggleSaveBtn',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto'
        },
        onAddPhotoClick: function(evt) {

            new PhotoAddActionsView().render({
                delegateId: this.$el.attr('id')
            }).inject();
        },
        capturePhoto: function(evt) {
            var self = this;

            navigator.device.capture.captureImage(captureImageSuccess, captureImageFail, {
                limit: 1
            });

            function captureImageSuccess(mediaFiles) {
                var sImgSrc = mediaFiles[0].fullPath;
                self.getPictureSuccess(sImgSrc);
            }

            function captureImageFail(error) {
                utils.debug.log(error);
            }
        },
        browsePhoto: function(evt) {
            var self = this;

            navigator.camera.getPicture(getPictureSuccess, getPictureFail, {
                quality: 10,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            });

            function getPictureSuccess(imageURI) {
                self.getPictureSuccess(imageURI);
            }

            function getPictureFail(msg) {
                utils.debug.log(msg);
            }
        },
        getPictureSuccess: function(fileURI, isExist) {

            var item = new AttachmentPhotoModel({
                attachment_id: 0,
                photo_url: fileURI
            });

            this.appendAttachmentItem(item, AttachmentAddPhotoItem, this.$attachment_photo_holder, isExist);
        },
        appendAttachmentItem: function(item, View, $holder, isExist) {

            if (!isExist) {
                this.photoUrl = item.getPhotoUrl();
            }

            this.$photo_add_btn.addClass('hide');

            var attachmentItem = new View({
                model: item
            });

            var context = {
                postDelete: isExist || false,
                iPollId: this.model.getId()
            };

            var inject = function(dom) {
                $holder.append(dom);
            };

            attachmentItem.render(context).inject(inject);

            attachmentItem.on('removesuccess', this.removeAttachmentItem, this);
        },
        removeAttachmentItem: function(item) {

            this.photoUrl = null;

            this.$photo_add_btn.removeClass('hide');
        },
        addAnswer: function(evt) {
            var $form_answer = this.$el.find('.poll-form-answer');
            var answerCnt = $form_answer.size();
            var answerLimit = this.perms.getMaxAnswer() || 6;

            if (answerCnt >= answerLimit) {
                return utils.modal.alert(_t('You have reached your limit.'));
            }

            this.$form_content.append(this.formAnswerTpl);
        },
        removeAnswer: function(evt) {
            var $form_answer = this.$el.find('.poll-form-answer');
            var answerCnt = $form_answer.size();

            if (answerCnt <= 2) {
                return utils.modal.alert(_t('You must have a minimum of 2 answers.'));
            }

            var $target = $(evt.currentTarget);
            $target.parent().remove();
        },
        onSaveClick: function(evt) {

            if (this.$save_btn.hasClass('processing')) {
                return;
            }

            var sQuestion = this.$form_question.val();
            var iHideVote = this.$form_hide_vote.val();
            var sPrivacy = this.$form_privacy.val() || 'everyone';
            var sPrivacyComment = this.$form_privacy_comment.val() || 'everyone';
            var aAnswer = [];

            var $form_answer = this.$el.find('.poll-form-answer');

            _.each($form_answer, function(answer) {
                if ($(answer).val().trim()) {
                    var ansItem = {
                        answer: $(answer).val(),
                        answer_id: $(answer).data('id') || 0
                    };
                    aAnswer.push(ansItem);
                }
            });

            // validate
            if (!sQuestion.trim()) {
                return utils.modal.alert(_t('Provide a question for your poll.'));
            }

            if (aAnswer.length < 2) {
                return utils.modal.alert(_t('You need to write at least 2 answers.'));
            }

            // passed
            var postData = {
                iPollId: this.model.getId(),
                aAnswer: JSON.stringify(aAnswer),
                iHideVote: iHideVote,
                iPrivacyComment: sPrivacyComment,
                iPrivacy: sPrivacy,
                sQuestion: sQuestion
            };

            if (this.photoUrl) {
                this.savePollWithPhoto(postData);
            } else {
                this.savePoll(postData);
            }
        },
        savePollWithPhoto: function(postData, settings) {

            utils.api.uploadImage('poll/edit', this.photoUrl, postData).done(this.saveDone);
        },
        savePoll: function(postData, settings) {

            var settings = {
                context: this
            };

            this.$save_btn.addClass('processing');

            utils.api.post('poll/edit', postData, settings).done(this.saveDone).always(function() {
                this.$save_btn.removeClass('processing');
            });
        },
        saveDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            window.location.href = '#poll/' + data.iPollId;
        },
        toggleSaveBtn: function(evt) {

            var sQuestion = this.$form_question.val();
            var iAnswerLength = 0;

            var $form_answer = this.$el.find('.poll-form-answer');

            _.each($form_answer, function(answer) {
                if ($(answer).val().trim()) {
                    iAnswerLength++;
                }
            });

            var bDisable = (!sQuestion.trim() || iAnswerLength < 2);
            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});