define([
    'text!forum/tpl/forum-announcement-item.html',
    'text!forum/tpl/forum-thread-item.html'
], function(textAnnouncement, text) {

    return Backbone.View.extend({
        className: 'forum-thread-item',
        template: _.template(text),
        render: function() {

            this.$el.attr('id', this.model.getDataId());

            if (this.model.isAnnouncement()) {
                this.template = _.template(textAnnouncement);
            }

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function(inject) {
            inject(this.el);
        }
    });
});