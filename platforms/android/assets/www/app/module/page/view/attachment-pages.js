define([
    'text!page/tpl/attachment-pages.html'
], function (text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-pages',
        template: _.template(text),
        render: function () {

            var item = this.model;

            var att = item.getAttachments()[0];

            var context = {
                item: item,
                attachment: att,
                sPhoto_Url: att.sPhoto_Url,
                attUrl: '#pages/' + att.iId
            };

            this.$el.html(this.template(context));

            return this;
        },
        inject: function (dom) {

            dom.html(this.el);
        }
    });
});