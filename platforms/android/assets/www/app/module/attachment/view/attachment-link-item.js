define([
    'text!attachment/tpl/attachment-link-item.html'
], function(text) {

    return Backbone.View.extend({
        region: {},
        className: 'user_add_content attachment-link-item',
        template: _.template(text),
        render: function() {

            this.$el.attr({
                'rel': 'externallink',
                'data-url': this.model.getUrl()
            });

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