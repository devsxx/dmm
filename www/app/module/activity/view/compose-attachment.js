define([
    'activity/view/compose-attachment-checkin',
    'activity/view/compose-attachment-link',
    'activity/view/compose-attachment-video',
    'text!activity/tpl/attachment-photo.html',
    'text!activity/tpl/compose-attachment.html'
], function(ComposeCheckinView, ComposeLinkView, ComposeVideoView, photoAttachmentTpl, composeTpl) {

    var ComposeAttachment = Backbone.View.extend({
        initialize: function() {
            this.maximumAttachment = 1;
            this.numOfAttachment = 0;
            utils.observer.on('attachment:success', function() {
                this.numOfAttachment++;
            }, this);

            utils.observer.on('attachment:remove', function() {
                this.numOfAttachment--;
            }, this);
        },
        events: {
            'click .js-status-add-attachment-link': 'addAttachment'
        },
        template: _.template(composeTpl),
        region: {
            main: '#compose_status_select_attachment_holder',
        },
        render: function(context) {

            this.context = $.extend({
                exclude: [] // what item in attachment you do NOT want to attach in
            }, context);
            this.$el.html(this.template(this.context));
            return this;
        },
        inject: function() {
            console.log(this.region);
            var $main = $(this.region.main);
            $main.html(this.el);
            return this;
        },
        addAttachment: function(e) {
            var data = $(e.currentTarget).data()

            if (this.numOfAttachment >= this.maximumAttachment) {
                utils.modal.alert('Cannot contain more than one item. Please remove the current selection before adding another item.');
                return false;
            }

            switch (data.type) {
                case 'video':
                    this.addVideo();
                    break;

                case 'link':
                    this.addLink();
                    break;

                case 'camera':
                    this.addFromCamera();
                    break;

                case 'gallery':
                    this.addFromGallery();
                    break;

                case 'checkin':
                    this.addCheckin();
                    break;
            }
        },
        browsePhotoSuccess: function(imageURI) {
            var tpl = _.template(photoAttachmentTpl),
                attachmentHtml = tpl({
                    sImgSrc: imageURI
                }),
                model = {
                    sImgSrc: imageURI
                };

            utils.observer.trigger('attachment:success', {
                data: model,
                html: attachmentHtml,
                type: 'photo'
            });
        },
        browePhotoFail: function(message) {

        },
        addFromGallery: function() {

            navigator.camera.getPicture(this.browsePhotoSuccess, this.browsePhotoFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG
            });
        },
        addFromCamera: function() {
            var self = this;

            navigator.device.capture.captureImage(onCameraSuccess, onCameraFail, {
                limit: 1
            });

            function onCameraSuccess(mediaFiles) {
                var sImgSrc = mediaFiles[0].fullPath;
                self.browsePhotoSuccess(sImgSrc);

            }

            function onCameraFail(error) {
                //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
            }
        },
        addLink: function() {
            this.composeLinkView = new ComposeLinkView();

            // this.$attachmentPickerHolder.html(this.composeStatusLinkView.render().el);
            this.composeLinkView.render().inject();
        },
        addVideo: function() {

            var self = this;

            var onSuccess = function(fileURI) {
                self.onGetVideoSuccess(fileURI);
            };

            var onFail = function(msg) {
                utils.debug.log(msg);
            };

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.VIDEO
            });
        },
        onGetVideoSuccess: function(fileURI) {

            this.composeVideoView = new ComposeVideoView();

            this.composeVideoView.render({
                fileURI: fileURI
            }).inject();
        },
        addCheckin: function() {
            this.composeCheckinView = new ComposeCheckinView();
            this.composeCheckinView.render().inject();
            $('body').addClass('bottom-open');
            utils.observer.trigger('bottom:open');
        }
    });

    return ComposeAttachment;
});