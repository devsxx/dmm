define([
    'text!blog/tpl/blog-index.html',
    'blog/view/blog-list',
    'blog/view/blog-search'
], function (text, BlogListView, SearchView) {

    return Backbone.PolyplatformView.extend({
        moduleId: 'blog/view/blog-index',
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function () {},
        render: function (query) {

            this.query = $.extend({}, query);

            this.$el.html(this.template(this.query));

            this.$listHolder = this.$el.find('#blog_list_holder');

            return this;
        },
        inject: function () {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.listView = new BlogListView({}, this.$listHolder, this.$scroller);

            this.listView.render(this.query).inject();

            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

            var self = this;

            this.searchView.on('submit', function (data) {
                self.listView.phraseNotFound = _t('No blogs found.');
                self.listView.resetQuery($.extend({}, self.query, data));
            });

            return this;
        }
    });
});