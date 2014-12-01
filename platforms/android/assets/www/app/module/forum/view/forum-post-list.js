define([
    'forum/model/post',
    'forum/view/forum-post-item',
    'text!forum/tpl/forum-post-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iThreadId: 0,
            iAmountOfPost: 10
        },
        followById: false,
        api: 'forum/threaddetail',
        phraseNotFound: 'No posts found.',
        phraseNotMore: 'No more posts.',
        className: 'post-list',
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

            if (!data.aPost) {
                return [];
            }

            return data.aPost.map(function(item) {
                return new ItemModel(item);
            });
        },
        loadMore: function() {

            var sendData = $.extend({}, this.query, {
                thread: false
            });

            this.$ajaxMore = this.apiFn(this.api, sendData, {
                context: this
            }).done(function(data) {
                (data.error_code && data.error_code > 0) ? this.loadMoreFail(data) : this.loadMoreSuccess(data);
            }).fail(this.loadMoreFail);
        }
    });
});