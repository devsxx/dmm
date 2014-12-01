define([
    'page/model/page',
    'page/view/page-item',
    'text!page/tpl/page-list.html'
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iAmountOfPage: 10,
            sSearch: ""
        },
        api: "pages/fetch",
        followById: false,
        phraseNotFound: _t('စာမ်က္ႏွာ မရွိေသးပါ။'),
        phraseNotMore: _t('စာမ်က္ႏွာ မရွိေသးပါ။'),
        className: 'page-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});