define([
    'text!user/tpl/select-crop-image.html'
], function(text) {

    return Backbone.View.extend({
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                imageURI: ''
            }, context);

            this.$el.html(this.template({
                context: this.context
            }));

            this.$img_container = this.$el.find('#img_container');

            var self = this;
            setTimeout(function() {
                self.initJcrop($('#profile_photo'));
            }, 200);

            return this;
        },

        initJcrop: function(element) {
            var self = this;
            var iViewWidth = element.width();
            var iViewHeight = element.height();

            this.iWidth = iViewWidth;
            this.iHeight = iViewHeight;

            var iMinSize = 48;
            if (iViewWidth < 48 || iViewHeight < 48) {
                iMinSize = Math.min(iViewWidth, iViewHeight);
            }

            var aCoords = [0, 0, 100, 100];

            if (iViewWidth > 100 && iViewHeight > 100) {
                aCoords[0] = iViewWidth / 2 - 50;
                aCoords[1] = iViewHeight / 2 - 50;
                aCoords[2] = aCoords[0] + 100;
                aCoords[3] = aCoords[1] + 100;
            } else {
                if (iViewHeight < iViewWidth) {
                    aCoords[0] = iViewWidth / 2 - iViewHeight / 2;
                    aCoords[1] = 0;
                    aCoords[2] = aCoords[0] + iViewHeight;
                    aCoords[3] = iViewHeight;
                } else {
                    aCoords[0] = 0;
                    aCoords[1] = iViewHeight / 2 - iViewWidth / 2;
                    aCoords[2] = iViewWidth;
                    aCoords[3] = aCoords[0] + iViewWidth;
                }
            }

            this.coordinates = aCoords[0] + ':' + aCoords[1] + ':' + iViewWidth + ':' + iViewHeight;
            element.Jcrop({
                aspectRatio: 1 / 1,
                minSize: [iMinSize, iMinSize],
                setSelect: aCoords,
                onSelect: getCoords,
                onChange: getCoords
            });

            function getCoords(c) {
                if (c.w > 0 && c.h > 0) {
                    self.coordinates = c.x + ':' + c.y + ':' + c.w + ':' + c.h;
                    // window.localStorage.setItem('ProfileEditAvatarView.sCoordinates', c.x + ':' + c.y + ':' + c.w + ':' + c.h);
                } else {
                    self.coordinates = '';
                }
            }
        },

        getData: function() {

            return {
                sCoordinates: this.coordinates,
                iHeight: this.iHeight,
                iWidth: this.iWidth,
                sImgSrc: this.context.imageURI
            }
        }
    });
});