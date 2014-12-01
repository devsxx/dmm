define([
    'forum/model/thread',
    'text!forum/tpl/attachment-forum-thread.html'
], function(ThreadModel, text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-forum-thread',
        template: _.template(text),
        render: function() {

            var item = this.model;
            var oAtt = item.getAttachments()[0];

            var att = new ThreadModel({
                iThreadId: oAtt.iId,
                sTitle: oAtt.sTitle,
                sText: oAtt.sDescription
            });

            var context = {
                item: item,
                att: att
            };

            this.$el.html(this.template(context));

            return this;
        },
        inject: function(dom) {
            dom.html(this.el);
        }
    });
});