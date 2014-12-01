define([
    'text!quiz/tpl/attachment-quiz.html'
], function (text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-quiz',
        template: _.template(text),
        render: function () {

            var item = this.model;
            var att = item.getAttachments()[0];

            var context = {
                item: item,
                attachment: att,
                attUrl: '#quiz/' + att.iId
            };

            this.$el.html(this.template(context));

            return this;
        },
        inject: function (dom) {
            dom.html(this.el);
        }
    });
});