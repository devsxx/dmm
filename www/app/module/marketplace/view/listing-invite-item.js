define([
    'text!marketplace/tpl/listing-invite-item.html'
], function(text) {

    return Backbone.View.extend({
        region: {},
        className: 'listing-invite-item',
        template: _.template(text),
        render: function() {

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