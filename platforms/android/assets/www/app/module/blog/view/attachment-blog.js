define([
    'text!blog/tpl/attachment-blog.html'
], function (text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-blog',
        template: _.template(text),
        render: function () {

            var item = this.model;
            var att = item.getAttachments()[0];

            var context = {
                item: item,
                attachment: att,
                attUrl: '#blog/' + att.iId
            };

            this.$el.html(this.template(context));

            return this;
        },
        inject: function (dom) {
            dom.html(this.el);
        }
    });
});