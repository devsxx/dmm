define([
    'photo/view/photo-list',
    'photo/view/photo-search',
    'page/view/page-detail-module',
    'page/view/page-detail-photo-topmenu',
    'text!page/tpl/page-detail-photos.html'
], function(ListView, SearchView, PageDetailModuleView, TopMenuView, text) {
    return PageDetailModuleView.extend({
        activeModule: 'photo',
        activeType: 'photos',
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
        }
    });
});