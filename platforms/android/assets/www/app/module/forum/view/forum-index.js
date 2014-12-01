define([
    'forum/view/forum-list',
    'forum/view/forum-search',
    'forum/view/forum-thread-moremenu',
    'text!forum/tpl/forum-index.html'
], function(ListView, SearchView, MoreMenuView, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            listHolder: '#forum_list_holder'
        },
        template: _.template(text),
        initialize: function() {},
        render: function(query) {

            this.query = $.extend({}, query);

            this.$el.html(this.template(this.query));

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.$list_holder = this.$el.find(this.region.listHolder);

            // list view
            this.listView = new ListView({}, this.$list_holder, this.$scroller, {
                loadnew: false,
                loadmore: false
            });

            this.listView.render(this.query).inject();

            // search view
            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

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