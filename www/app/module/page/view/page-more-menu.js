define([
    'text!page/tpl/page-more-menu.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                activeModule: ''
            }, context);

            this.$el.html(this.template({
                item: this.model,
                context: this.context
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