define([
    'music/view/playlist-list',
    'music/view/playlist-search',
    'page/view/page-detail-music-songs'
], function(ListView, SearchView, MusicSongsView) {
    return MusicSongsView.extend({
        activeType: 'albums',
        listView: ListView,
        searchView: SearchView,
        appendSearchView: function() {

            this.searchView = new this.searchView();

            this.searchView.render(this.query).inject();

            this.searchView.$el.find('#adv_search_toggle_btn').removeClass('no-padding');
            this.searchView.$el.find('#adv_search_holder').removeClass('no-padding');            

            var self = this;

            this.searchView.on('submit', function(data) {
                self.listView.resetQuery($.extend({}, self.query, data));
            });
        }

    });
});