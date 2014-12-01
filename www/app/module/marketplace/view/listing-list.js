define([
    'marketplace/model/listing',
    'marketplace/view/listing-item',
    'text!marketplace/tpl/listing-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iAmountOfMarketplace: 10,
            sSearch: ""
        },
        followById: false,
        api: 'marketplace/fetch',
        phraseNotFound: _t('No listings found.'),
        phraseNotMore: _t('No more listings.'),
        className: 'listing-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});