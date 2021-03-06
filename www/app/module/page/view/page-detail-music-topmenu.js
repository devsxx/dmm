define([
    'text!page/tpl/page-detail-music-topmenu.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                activeType: 'songs'
            }, context);

            this.$el.html(this.template({
                context: this.context,
                item: this.model
            }));

            return this;
        },
        events: {
            'touchend a': 'hideMenu'
        },
        hideMenu: function(evt) {

            if (utils.popup.isShown()) {
                utils.popup.close();
            }
        }
    });
});