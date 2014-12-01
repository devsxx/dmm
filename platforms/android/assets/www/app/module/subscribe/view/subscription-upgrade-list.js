define([
    'subscribe/model/package',
    'subscribe/view/subscription-upgrade-item',
    'text!subscribe/tpl/subscription-list.html'
],function(Model, ItemView, text){

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iAmountOfSubscribe: 20
        },
        followById: false,
        api: 'subscribe/fetch',
        phraseNotFound: 'No subscription plans found.',
        phraseNotMore: 'No more subscription plans.',
        className: 'subscription-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});
