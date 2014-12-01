define([
    'forum/view/forum-post-list',
    'forum/view/forum-search',
    'forum/view/forum-thread-list',
    'forum/view/forum-thread-moremenu',
    'text!forum/tpl/forum-search-results.html'
], function(PostListView, SearchView, ThreadListView, MoreMenuView, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            listHolder: '#list_holder'
        },
        template: _.template(text),
        initialize: function() {},
        render: function(query) {

            this.query = $.extend({
                isSearch: true,
                iAmountOfThread: 10
            }, query);

            this.$el.html(this.template(this.query));

            this.$search_result_header = this.$el.find('#search_result_header');

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.$list_holder = this.$el.find(this.region.listHolder);

            // search view
            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

            // search result list
            var ListView = (this.query.sSearchType == 'thread') ? ThreadListView : PostListView;

            this.listView = new ListView({
                api: 'forum/search',
            }, this.$list_holder, this.$scroller);

            this.listView.render(this.query).inject();

            return this;
        },
        events: {
            'click #footer_more_btn': 'showMoreMenu'
        },
        showMoreMenu: function(evt) {

            this.moreMenu = new MoreMenuView();

            this.moreMenu.render().inject();
        }
    });
});