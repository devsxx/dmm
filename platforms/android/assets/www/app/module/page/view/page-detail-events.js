define([
    'text!page/tpl/page-detail-events.html',
    'event/view/event-list',
    'event/view/event-search',
    'page/view/page-detail-module'
],function(text, ListView, SearchView, PageDetailModuleView){

    return PageDetailModuleView.extend({
        activeModule: 'event',
        listView: ListView,
        searchView: SearchView,
        template: _.template(text)
    });
});