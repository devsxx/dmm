define([
    'video/view/video-list',
    'video/view/video-search',
    'page/view/page-detail-module',
    'text!page/tpl/page-detail-videos.html'
], function(ListView, SearchView, PageDetailModuleView, text) {
    return PageDetailModuleView.extend({
        activeModule: 'video',
        listView: ListView,
        searchView: SearchView,
        template: _.template(text),
        updateView: function() {

            this.$add_btn = this.$el.find('#add_btn');

            this.$page_title.html(this.model.getTitle());

            if (this.model.canShareVideos()) {
                this.$add_btn.removeClass('hide');
            }
        }
    });
});