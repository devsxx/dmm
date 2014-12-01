define([
    'core',
    'photo/view/attachment-album-photo-item',
    'photo/view/photo-add-actions',
    'text!message/tpl/message-reply.html'
], function(core, AttachmentPhotoItemView, PhotoAddActionsView, text) {

    return Backbone.View.extend({
        region: {
            main: '#main',
            content: '#content'
        },
        template: _.template(text),
        render: function(iConversationId) {

            this.context = {
                viewer: core.viewer,
                iConversationId: iConversationId
            };

            this.$el.attr('id', 'message_reply');

            this.$el.html(this.template(this.context));

            this.$attachment_holder = this.$el.find('#reply_message_attachment_holder');
            this.$photo_add_btn = this.$el.find('#photo_add_btn');
            this.$send_btn = this.$el.find('#send_btn');

            return this;
        },
        inject: function() {
            var self = this;

            var main = $(this.region.main);

            main.html(this.el);

            var content = $(this.region.content);

            content.vscroll();

            utils.api.get('message/conversation_detail', {
                iConversationId: this.context.iConversationId
            })
                .done(function(data) {
                    if (data.hasOwnProperty('error_code') && data.error_code) {
                        utils.modal.alert(data.error_message);
                        return;
                    }

                    $('#page_title').html(data.sTitle);

                    self.appendRecipients(data.aRecipients);
                });

            return this;
        },
        appendRecipients: function(aRecipients) {
            var self = this;
            //remove current user from list
            var iViewerId = core.viewer.getId();
            var iRemove = -1;

            $.each(aRecipients, function(index, aRecipient) {
                if (aRecipient.iUserId == iViewerId) {
                    iRemove = index;
                }
            });

            if (iRemove > -1) {
                aRecipients.splice(iRemove, 1);
            }

            var lessSpan = $('#recipients_list_less');
            var moreSpan = $('#recipients_list_more');

            lessSpan.empty();
            moreSpan.empty();

            lessSpan.append('<a href="#user/' + aRecipients[0].iUserId + '">' + aRecipients[0].sUserName + '</a>');

            if (aRecipients.length > 1) {
                lessSpan.append(' and ' + (aRecipients.length - 1) + ' others');

                var moreList = "";
                _.each(aRecipients, function(aRecipient) {
                    moreList += ', <a href="#user/' + aRecipient.iUserId + '">' + aRecipient.sUserName + '</a>';
                });
                moreSpan.html(moreList.substring(2));

                $('#toggle_recipients').removeClass("hide");
            }

            $('#message-recipient-list').removeClass("hide");
        },
        events: {
            'click #photo_add_btn': 'onAddPhotoClick',
            'click #send_btn': 'onSendClick',
            'click #toggle_recipients': 'toggleRecipients',
            'click .close_button': 'removeAttachment',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto'
        },
        onAddPhotoClick: function(evt) {

            new PhotoAddActionsView().render({
                delegateId: this.$el.attr('id')
            }).inject();
        },
        capturePhoto: function() {

            var self = this;

            navigator.device.capture.captureImage(onSuccess, onFail, {
                limit: 1
            });

            function onSuccess(mediaFiles) {
                var imageURI = mediaFiles[0].fullPath;
                self.addPhotoItem(imageURI);
            }

            function onFail(msg) {
                utils.debug.warn(msg);
            }
        },
        browsePhoto: function() {

            var self = this;

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation: true
            });

            function onSuccess(imageURI) {
                self.addPhotoItem(imageURI);
            }

            function onFail(msg) {
                utils.debug.warn(msg);
            }
        },
        addPhotoItem: function(path) {

            var self = this;

            var inject = function(dom) {
                self.$attachment_holder.html(dom);
            };

            new AttachmentPhotoItemView().render({
                PhotoId: 0,
                ImgSrc: path
            }).inject(inject);

            this.$photo_add_btn.addClass('hide');
        },
        removeAttachment: function() {

            this.$attachment_holder.empty();

            this.$photo_add_btn.removeClass('hide');
        },
        toggleRecipients: function(evt) {
            var target = $(evt.currentTarget);
            var lessSpan = $('#recipients_list_less');
            var moreSpan = $('#recipients_list_more');

            lessSpan.toggleClass("hide");
            moreSpan.toggleClass("hide");

            current = target.html();
            target.html(current == "More" ? "Less" : "More");
        },
        onSendClick: function(evt) {

            if (this.$send_btn.hasClass("processing")) {
                return;
            }

            var replyMsg = $('#reply_message').val();
            if (replyMsg.trim() == '') {
                utils.modal.alert("Please fill the message.");
                return;
            }

            var postData = {
                iItemId: this.context.iConversationId,
                sText: replyMsg
            };
            var settings = {
                context: this
            }

            var attachmentPhoto = this.$attachment_holder.find('.attachment-photo-image');

            if (attachmentPhoto.length > 0 && attachmentPhoto.data('src')) {
                this.sendReplyWithPhoto(postData, settings, attachmentPhoto.data('src'));
            } else {
                this.sendReply(postData, settings);
            }
        },
        sendReply: function(postData, settings) {

            this.$send_btn.addClass('processing');

            utils.api.post('message/reply', postData, settings).done(this.postDone).always(this.postComplete);
        },
        postDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            window.location.href = '#messages/sent';
        },
        postComplete: function() {

            this.$send_btn.removeClass('processing');
        },
        sendReplyWithPhoto: function(postData, settings, imageURI) {

            var self = this;

            function done(result) {
                if (result.sImagePath != null) {
                    self.handleUploadPhotoSuccess(postData, settings, result);
                } else {
                    utils.modal.alert(result.error_message || _t('Can not upload file(s). Please try again later.'));
                    utils.debug.warn('[FAIL] message/attach', result);
                }
            };

            function fail(err) {
                utils.debug.warn('[FAIL] message/attach', err);
            };

            utils.api.uploadImage('message/attach', imageURI, {}).done(done).fail(fail);
        },
        handleUploadPhotoSuccess: function(postData, settings, result) {

            postData['sText'] = postData['sText'] + ' ' + result.sImagePath;
            postData['attachmentData'] = {
                "type": "photo"
            };

            this.sendReply(postData, settings);
        }
    });
});