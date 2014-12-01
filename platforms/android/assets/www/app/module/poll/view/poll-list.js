define([
    'poll/model/poll',
    'poll/view/poll-item',
    'text!poll/tpl/poll-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iAmountOfPoll: 10,
            sSearch: ""
        },
        followById: false,
        api: 'poll/fetch',
        phraseNotFound: _t('No polls found.'),
        phraseNotMore: _t('No more polls.'),
        className: 'poll-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});