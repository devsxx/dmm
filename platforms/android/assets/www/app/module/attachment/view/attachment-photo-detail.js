define([
    'text!attachment/tpl/attachment-photo-detail.html'
], function(text) {
    return Backbone.View.extend({
        region: {
            wrapper: '#main-bottom',
            scroller: '#content-bottom'
        },
        template: _.template(text),
        render: function() {

            this.$el.html(this.template({
                item: this.model
            }));

            this.$scroller = this.$el.find(this.region.scroller);

            return this;
        },
        inject: function() {

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.enableZoom();

            utils.observer.trigger('bottom:open');
        },
        enableZoom: function() {

            var inScroll = this.$el.find('#photo_zoom').get(0);

            this.oZoom = new iScroll(inScroll, {
                hideScrollbar: true,
                hScrollbar: false,
                vScrollbar: false,
                zoom: true,
                // Since the images are inside of the swiper slide it
                // got a huge left offset, but the offset isn't really
                // part of the page/image since the page is completely
                // shown within the viewable area of the viewport. So
                // simply remove the wrapperOffsetLeft from the
                // calculation and be happy.
                //
                // touchstart: When pinch-zooming
                // touchend: When double-tap zooming
                onZoomStart: function(e) {
                    if (e.type === 'touchstart') {
                        this.originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX) / 2 - this.x;
                    } else if (e.type === 'touchend') {
                        this.wrapperOffsetLeft = 0;
                    }
                }
            });
        },
        events: {
            'click #close_btn': 'closeView'
        },
        closeView: function() {
            utils.observer.trigger('bottom:close');
        }
    });
});