define([
    'forum/model/post',
    'forum/model/thread',
    'text!forum/tpl/attachment-forum-post.html'
], function(PostModel, ThreadModel, text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-forum-post',
        template: _.template(text),
        render: function() {

            var feed = this.model;
            var oAtt = feed.getAttachments()[0];

            var item = new PostModel({
                iPostId: oAtt.iId,
                sText: oAtt.sDescription
            });

            var thread = new ThreadModel({
                iThreadId: feed.getItemId(),
                sTitle: feed.getItemTitle()
            });

            this.$el.html(this.template({
                item: item,
                thread: thread
            }));

            return this;
        },
        inject: function(dom) {
            dom.html(this.el);
        }
    });
});