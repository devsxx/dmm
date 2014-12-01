define([
    'blog/view/blog-list',
    'blog/view/blog-search',
    'page/view/page-detail-module',
    'text!page/tpl/page-detail-blogs.html'
], function(ListView, SearchView, PageDetailModuleView, text) {
    return PageDetailModuleView.extend({
        activeModule: 'blog',
        listView: ListView,
        searchView: SearchView,
        template: _.template(text),
        updateView: function() {

            this.$add_btn = this.$el.find('#add_btn');

            this.$page_title.html(this.model.getTitle());

            if (this.model.canShareBlogs()) {
                this.$add_btn.removeClass('hide');
            }
        },
        appendSearchView: function() {

            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

            var self = this;

            this.searchView.on('submit', function(data) {
                self.listView.phraseNotFound = _t('No blogs found.');
                self.listView.resetQuery($.extend({}, self.query, data));
            });
        }
    });
});