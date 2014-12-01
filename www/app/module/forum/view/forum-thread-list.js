define([
    'forum/model/thread',
    'forum/view/forum-thread-item',
    'text!forum/tpl/forum-thread-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iForumId: 0,
            iAmountOfThread: 10
        },
        followById: false,
        api: 'forum/detail',
        phraseNotFound: 'No threads found.',
        phraseNotMore: 'No more threads.',
        className: 'thread-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView,
        inject: function(data) {

            this.$holder.html(this.$el);

            this.isFirst = true;

            data ? this.loadMoreSuccess(data) : this.loadMore();

            return this;
        },
        parseData: function(data, ItemModel) {

            if (!data.aThread) {
                return [];
            }

            return data.aThread.map(function(item) {
                return new ItemModel(item);
            });
        }
    });
});