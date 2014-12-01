define([
    'photo/view/album-list',
    'photo/view/album-search',
    'page/view/page-detail-photos'
], function(ListView, SearchView, PhotosView) {
    return PhotosView.extend({
        activeType: 'albums',
        listView: ListView,
        searchView: SearchView
    });
});