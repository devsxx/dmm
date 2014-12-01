define([
    'attachment/model/attachment-photo',
    'attachment/view/attachment-form-link',
    'attachment/view/attachment-add-link-item',
    'attachment/view/attachment-add-photo-item',
    'blog/view/blog-categories',
    'photo/view/photo-add-actions',
    'text!blog/tpl/blog-edit.html',
    'text!blog/tpl/blog-edit-form.html'
], function(AttachmentPhotoModel, AttachmentFormLink, AttachmentAddLinkItem, AttachmentAddPhotoItem, CategoriesView, PhotoAddActionsView, text, formText) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#blog-edit'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        render: function(context) {

            this.context = $.extend({}, context);

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template(this.context));

            this.$form_holder = this.$el.find(this.region.formHolder);
            this.$save_btn = this.$el.find('#save_btn');

            this.aAttachmentIds = [];
            this.aCategoryIds = [];
            this.sCategoriesFilter = '';

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
            utils.api.get('blog/formedit', {
                iBlogId: this.model.getId()
            }, {
                context: this
            }).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.model.set(data);
            this.updateView();
        },
        updateView: function(data) {

            this.$form_holder.html(this.formTemplate({
                item: this.model
            }));

            this.$form_title = this.$el.find('#blog_form_title');
            this.$form_post = this.$el.find('#blog_form_post');
            this.$form_status = this.$el.find('#blog_form_status');
            this.$form_privacy = this.$el.find('#blog_form_privacy');
            this.$form_privacy_comment = this.$el.find('#blog_form_privacy_comment');
            this.$attachment_photo_holder = this.$el.find('#attachment_photo_holder');
            this.$attachment_link_holder = this.$el.find('#attachment_link_holder');

            this.appendAttachments();

            this.toggleSaveBtn();

            // bind input edit, paste events
            var self = this;
            this.$form_post.bind('input propertychange', function() {
                self.toggleSaveBtn();
            });
        },
        appendAttachments: function() {

            _.each(this.model.getAttachmentPhotos(), function(item) {
                this.appendAttachmentItem(item, AttachmentAddPhotoItem, this.$attachment_photo_holder);
            }, this);

            _.each(this.model.getAttachmentLinks(), function(item) {
                this.appendAttachmentItem(item, AttachmentAddLinkItem, this.$attachment_link_holder);
            }, this);
        },
        fetchDataFail: function() {
            utils.debug.log(arguments);
            utils.history.back();
        },
        events: {
            'click #attach_gallery_btn': 'onAddPhotoClick',
            'click #attach_link_btn': 'onAttachLink',
            'click #insert_image_btn': 'onGalleryInsert',
            'click #save_btn': 'saveBlog',
            'click .categories-btn': 'showCategories',
            'keyup #blog_form_title': 'toggleSaveBtn',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto',
            'updatecategories': 'updateCategories'
        },
        showCategories: function(evt) {

            var $target = $(evt.currentTarget);
            var filter = $target.data('filter') || 'public';

            if (filter != this.sCategoriesFilter) {
                this.aCategoryIds = [];
                this.sCategoriesFilter = filter;
            }

            var aCategories = _.map(this.model.getCategoryOptions(filter), function(oCategory) {
                return {
                    bSelected: (this.aCategoryIds.indexOf(oCategory.category_id) > -1),
                    iId: oCategory.category_id,
                    sName: oCategory.name
                };
            }, this);

            new CategoriesView().render({
                delegateId: this.$el.attr('id'),
                filter: filter,
                list: aCategories
            }).inject();
        },
        updateCategories: function(evt, data) {

            this.aCategoryIds = data.selected || [];
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
                    sModule: 'blog'
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

            this.$form_post.val(this.$form_post.val() + imgTag);
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
                sModule: 'blog'
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
                sModule: 'blog'
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
                sModule: 'blog'
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
        saveBlog: function(evt) {

            var $target = $(evt.currentTarget);

            if ($target.hasClass('processing')) {
                return;
            }

            var sTitle = this.$form_title.val();
            var sPost = this.$form_post.val();
            var sStatus = this.$form_status.val() || 'publish';
            var iPrivacy = this.$form_privacy.val() || 0;
            var iPrivacyComment = this.$form_privacy_comment.val() || 0;

            // validate
            if (!sTitle.trim()) {
                return utils.modal.alert(_t('Fill in a title for your blog'));
            }

            if (!sPost.trim()) {
                return utils.modal.alert(_t('Add some content to your blog'));
            }

            // passed
            var postData = {
                iBlogId: this.model.getId(),
                iPrivacy: iPrivacy,
                iPrivacyComment: iPrivacyComment,
                sAttachment: this.aAttachmentIds.join(),
                sCategories: this.aCategoryIds.join(),
                sStatus: sStatus,
                sText: sPost,
                sTitle: sTitle
            };

            var settings = {
                context: this
            }

            $target.addClass('processing');

            utils.api.post('blog/edit', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                window.location.href = data.iBlogId ? ('#blog/' + data.iBlogId) : 'blogs/my';
            }).always(function() {
                $target.removeClass('processing');
            });
        },
        toggleSaveBtn: function(evt) {

            var sTitle = this.$form_title.val();
            var sPost = this.$form_post.val();

            var bDisable = (!sTitle.trim() || !sPost.trim());

            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});