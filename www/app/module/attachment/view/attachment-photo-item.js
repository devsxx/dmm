define([
    'attachment/view/attachment-photo-detail',
    'text!attachment/tpl/attachment-photo-item.html'
], function(AttachmentPhotoDetailView, text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-photo-item',
        template: _.template(text),
        render: function(item) {

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function(inject) {
            inject(this.el);
        },
        events: {
            'click': 'showDetail'
        },
        showDetail: function(evt) {

            new AttachmentPhotoDetailView({
                model: this.model
            }).render().inject();
        }
    });
});