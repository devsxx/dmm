define([
    'text!poll/tpl/poll-vote-item.html'
], function(text) {

    return Backbone.View.extend({
        className: 'poll-vote-item',
        template: _.template(text),
        render: function() {

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function(callback) {

            callback(this.$el);

            return this;
        }
    });
});