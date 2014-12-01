define([
    'text!user/tpl/edit-user-photo.html',
    'user/view/select-crop-image',
    'jcrop',
    'jcolor',
], function() {

    var text = require('text!user/tpl/edit-user-photo.html'),
        SelectCropImageView = require('user/view/select-crop-image');

    return Backbone.View.extend({
        initialize: function() {
            this.coordinates = '';
            this.sImgSrc = '';
            this.cropView = new SelectCropImageView();
        },
        events: {
            'click #save-photo': 'savePhoto'
        },
        template: _.template(text),
        region: {
            main: '#main',
        },
        render: function(context) {

            this.context = $.extend({
                imageURI: ''
            }, context);

            this.$holder = $(this.region.main);

            this.$el.html(this.template());

            this.$scroller = this.$el.find('#content');

            this.$postBtn = this.$el.find('#save-photo');

            return this;
        },

        inject: function() {

            this.$holder.html(this.$el);

            this.$el.find('#edit-avatar').html(this.cropView.render(this.context).el);

            return this;
        },

        savePhoto: function() {
            var params = {
                iUserId: this.model.getId()
            },
                cropData = this.cropView.getData();

            if (cropData.coordinates !== '') {
                params.sCoordinates = cropData.sCoordinates;
                params.iWidth = cropData.iWidth;
                params.iHeight = cropData.iHeight;
            }

            function done(data) {
                if (data.error_code > 0) {
                    utils.modal.alert(data.error_message || 'Post URL failed!');
                    return false;
                } else {
                    utils.modal.toast('Edit sucessfully');
                    utils.observer.trigger('user:update');
                    utils.history.back();
                }

            };

            function fail(result) {
                // utils.modal.alert('Cannot upload photo');
            };

            utils.api.uploadImage('user/edit_avatar', cropData.sImgSrc, params).done(done).fail(fail);
        }
    });
});