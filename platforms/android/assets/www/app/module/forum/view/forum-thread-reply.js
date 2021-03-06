define([
    'attachment/model/attachment-photo',
    'attachment/view/attachment-form-link',
    'attachment/view/attachment-add-link-item',
    'attachment/view/attachment-add-photo-item',
    'photo/view/photo-add-actions',
    'text!forum/tpl/forum-thread-reply.html',
    'text!forum/tpl/forum-thread-reply-form.html'
], function(AttachmentPhotoModel, AttachmentFormLink, AttachmentAddLinkItem, AttachmentAddPhotoItem, PhotoAddActionsView, text, formText) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#forum-thread-reply'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        render: function(context) {

            this.context = $.extend({
                iPostId: 0
            }, context);

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template());

            this.$form_holder = this.$el.find(this.region.formHolder);
            this.$save_btn = this.$el.find('#save_btn');

            this.aAttachmentIds = [];

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
                iThreadId: this.model.getId(),
                iPostId: this.context.iPostId
            };
            var settings = {
                context: this
            }

            utils.api.post('forum/threadformreply', postData, settings).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.formData = $.extend({
                bIsSubscribed: false,
                sQuote: ''
            }, data);

            this.updateView();
        },
        updateView: function(data) {

            this.$form_holder.html(this.formTemplate(this.formData));

            this.$form_message = this.$el.find('#forum_thread_form_message');
            this.$form_subscribe = this.$el.find('#forum_thread_form_subscribe');
            this.$attachment_photo_holder = this.$el.find('#attachment_photo_holder');
            this.$attachment_link_holder = this.$el.find('#attachment_link_holder');

            // bind input edit, paste events
            var self = this;
            self.toggleSaveBtn();
            this.$form_message.bind('input propertychange', function() {
                self.toggleSaveBtn();
            });
        },
        fetchDataFail: function(jqXHR, textStatus, errorThrown) {

            utils.debug.warn('fetchDataFail', arguments);

            utils.history.back();
        },
        events: {
            'click #attach_gallery_btn': 'onAddPhotoClick',
            'click #attach_link_btn': 'onAttachLink',
            'click #insert_image_btn': 'onGalleryInsert',
            'click #save_btn': 'saveReply',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto'
        },
        onGalleryInsert: function(evt) {

            navigator.camera.getPicture(onGallerySuccess, onGalleryFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG
            });

            var self = this;

            function onGallerySuccess(fileURI) {
                utils.api.uploadImage('attachment/attachphoto', fileURI, {
                    sModule: 'forum'
                }).done(function(data) {
                    if (data.error_code && data.error_code > 0) {
                        return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                    }

                    if (!data.sImagePath) {
                        return utils.modal.alert(_t('Can not insert image. Please try again later.'));
                    }

                    self.insertImage(data);
                }).fail(function(error) {
                    utils.debug.warn(error);
                })
            }

            function onGalleryFail(msg) {
                utils.debug.log(msg);
            }
        },
        insertImage: function(data) {

            var imgTag = '[img]' + data.sImagePath + '[/img]';

            this.$form_message.val(this.$form_message.val() + imgTag);
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
        getPictureSuccess: function(fileURI) {

            var self = this;

            utils.api.uploadImage('attachment/attachfile', fileURI, {
                sModule: 'forum'
            }).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                self.attachImageSuccess(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                utils.debug.warn('attachImageFail', arguments);
            });
        },
        attachImageSuccess: function(data) {

            var item = new AttachmentPhotoModel({
                attachment_id: data.iId,
                photo_url: data.sImagePath
            });

            this.appendAttachmentItem(item, AttachmentAddPhotoItem, this.$attachment_photo_holder);
        },
        onAttachLink: function(evt) {

            this.attachmentFormLink = new AttachmentFormLink();

            this.attachmentFormLink.render({
                sModule: 'forum'
            }).inject();

            this.attachmentFormLink.on('attachsuccess', function(item) {
                this.appendAttachmentItem(item, AttachmentAddLinkItem, this.$attachment_link_holder);
            }, this);
        },
        appendAttachmentItem: function(item, View, $holder) {

            this.aAttachmentIds.push(item.getId());

            var attachmentItem = new View({
                model: item
            });

            var context = {
                sModule: 'forum'
            };

            var inject = function(dom) {
                $holder.append(dom);
            };

            attachmentItem.render(context).inject(inject);

            attachmentItem.on('removesuccess', this.removeAttachmentItem, this);
        },
        removeAttachmentItem: function(item) {

            var index = this.aAttachmentIds.indexOf(item.getId());
            if (index > -1) {
                this.aAttachmentIds.splice(index, 1);
            }
        },
        saveReply: function(evt) {

            var $target = $(evt.currentTarget);

            if ($target.hasClass('processing')) {
                return;
            }

            var sMessage = this.$form_message.val();
            var iSubscribe = this.$form_subscribe.val();

            if (!sMessage.trim()) {
                return utils.modal.alert(_t('Provide some text.'));
            }

            // passed
            var postData = $.extend(this.context, {
                iIsSubscribed: iSubscribe,
                iThreadId: this.model.getId(),
                sAttachment: this.aAttachmentIds.join(),
                sText: sMessage
            });

            var settings = {
                context: this
            }

            $target.addClass('processing');

            utils.api.post('forum/threadreply', postData, settings).done(this.saveDone).always(function() {
                $target.removeClass('processing');
            });
        },
        saveDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            if (data.message) {
                utils.modal.toast(data.message);
            }

            utils.history.back();
        },
        toggleSaveBtn: function(evt) {

            var sMessage = this.$form_message.val();

            var bDisable = !sMessage.trim();

            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});