define([
    'text!subscribe/tpl/subscription-item.html'
],function(text) {

    return Backbone.ItemView.extend({
        className: 'subscription-item',
        template: _.template(text),
        events: {
        },

        render: function (context) {

            this.$el.html(this.template({item: this.model}));

            this.$el.attr({
                'id': this.model.getDataId(),
                'rel': 'link',
                'data-url': this.model.getUrl()
            });

            return this;
        },

        inject: function (inject) {
            inject(this.$el);
            return this;
        }
    });
});
