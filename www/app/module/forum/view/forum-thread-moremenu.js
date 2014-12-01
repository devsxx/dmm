define([
    'text!forum/tpl/forum-thread-moremenu.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                sView: ''
            }, context);

            this.$el.html(this.template({
                context: this.context
            }));

            return this;
        },
        events: {
            'touchend a': 'closeThis'
        },
        closeThis: function(evt) {

            utils.popup.close();
        }
    });
});