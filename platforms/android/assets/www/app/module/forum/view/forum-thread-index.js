define([
    'forum/view/forum-thread-list',
    'forum/view/forum-thread-moremenu',
    'text!forum/tpl/forum-thread-index.html'
], function(ListView, MoreMenuView, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            listHolder: '#forum_thread_list_holder'
        },
        template: _.template(text),
        initialize: function() {},
        render: function(query) {

            this.query = $.extend({
                sView: 'new'
            }, query);

            this.$el.html(this.template(this.query));

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.$list_holder = $(this.region.listHolder);

            this.listView = new ListView({}, this.$el.find(this.$list_holder), this.$scroller);

            this.listView.render(this.query).inject();

            return this;
        },
        events: {
            'click #footer_more_btn': 'showMoreMenu'
        },
        showMoreMenu: function(evt) {

            this.moreMenu = new MoreMenuView();

            this.moreMenu.render(this.query).inject();
        }
    });
});