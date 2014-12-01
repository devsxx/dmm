define([
    'text!photo/tpl/photo-detail-item.html',
    'photo/view/photo-detail-action',
], function(text, ActionView) {

    return Backbone.ItemView.extend({
        className: 'content-slide',
        template: _.template(text),
        actionView: ActionView,
        render: function(context) {

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function(inject) {
            inject(this.el);
        },
        events: {
            'active': 'onActive',
        },
        onActive: function() {
            new this.actionView({
                model: this.model
            }).render().inject();
        }
    });
});