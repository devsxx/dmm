define([
    'music/view/song-list',
    'music/view/song-search',
    'page/view/page-detail-module',
    'page/view/page-detail-music-topmenu',
    'text!page/tpl/page-detail-music.html'
], function(ListView, SearchView, PageDetailModuleView, TopMenuView, text) {
    return PageDetailModuleView.extend({
        activeModule: 'music',
        activeType: 'songs',
        listView: ListView,
        searchView: SearchView,
        topMenuView: TopMenuView,
        template: _.template(text),
        events: {
            'click #footer_more_btn': 'showMoreMenu',
            'click #top_menu_btn': 'showTopMenu'
        },        
        showTopMenu: function() {

            this.topMenu = new TopMenuView({
                model: this.model
            }).render({
                activeType: this.activeType
            }).inject();
        },
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