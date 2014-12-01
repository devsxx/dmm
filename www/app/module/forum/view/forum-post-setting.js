define([
    'text!forum/tpl/forum-post-setting.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text),
        render: function(query) {

            this.query = $.extend({
                thread: null
            }, query);

            this.$el.html(this.template({
                item: this.model,
                thread: this.query.thread
            }));

            return this;
        }
    });
});