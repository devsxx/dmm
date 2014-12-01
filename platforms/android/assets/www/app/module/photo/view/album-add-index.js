define([
    'text!photo/tpl/album-add-index.html',
    'text!photo/tpl/album-add-form.html',
    'photo/view/attachment-album-photo-item',
    'photo/collection/photo',
    'photo/view/photo-add-actions'
], function(text, textForm, ItemView, PhotoCollection, PhotoAddActionsView) {

    return Backbone.View.extend({
        region: {
            wrapper: '#main',
            scroller: '#content',
            photo_list: '#photo_upload_list',
            edit_form: '#photo-album-edit'
        },

        template: _.template(text),

        templateForm: _.template(textForm),

        initialize: function() {
            this.photos = new PhotoCollection();
        },

        render: function(context) {

            this.context = $.extend({
                aPhotoListId: [],
                iItemId: null,
                sModule: null,
                typeForm: null
            }, context);

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template(this.context));

            this.$postBtn = $('#save_btn', this.$el);

            this.$scroller = this.$el.find(this.region.scroller);

            return this;

        },

        inject: function() {

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            this.$scroller.trigger('refresh');
        },

        events: {
            'click #photo_add_btn': 'onAddPhotoClick',
            'click #save_btn': 'createAlbum',
            'click .close_button': 'deletePhoto',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto'
        },

        onAddPhotoClick: function(evt) {

            new PhotoAddActionsView().render({
                delegateId: this.$el.attr('id')
            }).inject();
        },

        addPhotoItem: function(photoid, path) {

            var self = this;

            var inject = function(dom) {
                self.$photoAddBtn.before(dom);
            };

            new ItemView().render({
                PhotoId: photoid,
                ImgSrc: path
            }).inject(inject);

            this.$scroller.trigger('refresh');
        },

        fetchData: function() {
            var tasks = [];
            var self = this;
            this.dataInfo = {
                typeForm: this.context.typeForm
            };


            var $ajax2 = utils.api.get('photo/formadd', {}).done(function(data) {
                self.dataInfo = $.extend(self.dataInfo, data);
            }).fail(function() {});

            if (this.context.typeForm == 'edit') {
                // Get album detail info
                var $ajax1 = utils.api.get("photo/albumview", {
                    iAlbumId: this.model.getId()
                }).done(function(data) {
                    // self.dataInfo.sDescription = data.sDescription;
                    self.dataInfo = $.extend(self.dataInfo, data);
                }).fail(function(data) {
                    utils.debug.log(data);
                });


                var $ajax3 = utils.api.get('photo/listalbumphoto', {
                    iAlbumId: this.model.getId(),
                    iAmountOfPhoto: 500
                }, this.context).done(function(data) {
                    self.photos.add(data);
                }).fail(function() {
                    utils.debug.log(arguments);
                });

                $.when($ajax1, $ajax3, $ajax2).done(function() {
                    self.updateView();
                });

            } else {
                $.when($ajax2).done(function() {
                    self.updateView();
                });
            }


        },

        updateView: function() {

            // var self = this;

            var $actionBarHodler = this.$el.find('#photo-album-edit');

            $actionBarHodler.html(this.templateForm({
                context: this.context,
                data: this.dataInfo
            }));

            this.$photoAddBtn = this.$el.find('#photo_add_btn');

            if (this.context.typeForm == 'edit') {
                _.each(this.photos.models, function(item) {
                    this.addPhotoItem(item.getId(), item.getImgSrc());
                }, this);
            }

            var self = this;

            window.setTimeout(function() {
                self.$scroller.trigger('refresh');
            }, 1000);
        },

        createAlbum: function() {
            if (this.$postBtn.isProcessing()) {
                return;
            }

            this.context.sTitle = $('#sTitle').val();
            this.context.sDescription = $('#sDescription').val();
            this.context.iCategoryId = $('#category_select').val();
            this.context.sAuthView = $('#iPrivacy').val() || "everyone";
            this.context.sAuthComment = $('#iPrivacyComment').val() || "everyone";

            if (!this.context.sTitle) {
                return utils.modal.alert(_t('Provide a name for your album.'));
            }

            var totalPhotos = $(this.region.photo_list + " div.attachment-photo-item").size();
            if (totalPhotos <= 0) {
                return utils.modal.alert(_t('Album must have at least one photo.'));
            }

            var self = this;

            // Create album

            var api = (this.context.typeForm == 'create') ? 'photo/albumcreate' : 'photo/albumedit',
                data = $.extend(this.context, {
                    iAlbumId: this.model.getId()
                }),
                settings = {
                    'context': this,
                    'beforeSend': this.beforeSend
                };

            utils.api.post(api, data, settings).done(this.postDone).always(this.postComplete);

        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.$postBtn.isProcessing(false);
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$postBtn.isProcessing(true);
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if (data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function(data) {
            var totalPhotos = $(this.region.photo_list + " div.attachment-photo-item").size();;
            this.model.set('iAlbumId', data.iAlbumId);
            if (totalPhotos <= 0) {
                this.createFeed();
            } else {
                this.uploadPhotos(0, totalPhotos);
            }

        },

        uploadPhotos: function(index, total) {
            var photoUploadList = $('#photo_upload_list > div').eq(index);

            var path = photoUploadList.find("span.attachment-photo-image").data('src');

            var photoid = photoUploadList.find("span.attachment-photo-image").data('photoid');

            var self = this;

            if (photoid == 0) {

                var postData = $.extend(this.context, {
                    iAlbumId: this.model.getId()
                });

                utils.api.uploadImage("photo/upload", path, postData).done(function(result) {
                    self.context.aPhotoListId.push(result.iPhotoId);
                    if ((index + 1) >= total) {
                        self.createFeed();
                    } else {
                        self.uploadPhotos((index + 1), total);
                    }
                });

            } else if (photoid > 0) {

                if ((index + 1) >= total) {
                    self.createFeed();
                } else {
                    self.uploadPhotos((index + 1), total);
                }
            }
        },

        createFeed: function() {
            var params;

            params = $.extend(this.context, {
                sPhotoIds: this.context.aPhotoListId.join(','),
                iAlbumId: this.model.getId()
            });

            if (this.context.typeForm == 'edit') {
                utils.modal.toast('You have edited the album successfully');
            } else {
                utils.modal.toast('You have created the album successfully');
            }

            if (this.context.aPhotoListId.length == 0) { // do NOT create feed if there is no photo
            } else {
                utils.api.get('photo/postfeed', params).done(function(data) {});
            }

            utils.history.back();

        },

        capturePhoto: function() {

            var self = this;

            navigator.device.capture.captureImage(onSuccess, onFail, {
                limit: 1
            });

            function onSuccess(mediaFiles) {
                var imageURI = mediaFiles[0].fullPath;
                self.addPhotoItem(0, imageURI);
            }

            function onFail(msg) {
                self.$scroller.trigger('refresh');
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
                var flag = true


                if ($("#photo_upload_list").find("span.attachment-photo-image").length > 0) {
                    $("#photo_upload_list").find("span.attachment-photo-image").each(function() {
                        if ($(this).data('src') == imageURI) {
                            utils.modal.alert(_t("The image has been selected!"));
                            flag = false
                        }
                    });
                }

                if (flag) {
                    self.addPhotoItem(0, imageURI);
                }
            }

            function onFail(msg) {
                self.$scroller.trigger('refresh');
            }
        },

        deletePhoto: function(event) {
            var totalPhotos = $(this.region.photo_list + " div.attachment-photo-item").size();
            if (totalPhotos == 1) {
                return utils.modal.alert(_t('Album must have at least one photo.'));
            }

            var el = $(event.target).parents('.attachment-photo-item');
            var photoId = $(event.target).find('#remove_att').data('photoid') || 0;

            if (photoId) {
                var jData = {
                    iPhotoId: photoId
                };

                utils.modal.confirm(_t('Are you sure to delete this photo? (*Note: This action cannot rollback)'), function(confirm) {
                    if (confirm == 1) {
                        el.parent().remove();
                        utils.api.get("photo/delete", jData).done(function(data) {
                            utils.modal.toast("The photo has been deleted successfully.");
                        }).fail(function(data) {
                            utils.debug.log(arguments);
                        });
                    }
                }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
            } else {
                el.parent().remove();
                var totalAdded = window.localStorage.getItem('album.totalAdded') || 0;
                if (totalAdded > 0) {
                    totalAdded--;
                    window.localStorage.setItem('album.totalAdded', totalAdded);
                }
            }
        }
    });
});