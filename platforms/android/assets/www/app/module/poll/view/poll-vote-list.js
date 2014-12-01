define([
    'poll/model/vote',
    'poll/view/poll-vote-item',
    'text!poll/tpl/poll-vote-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPollId: 0
        },
        followById: false,
        api: 'poll/voter',
        phraseNotFound: _t('No members found.'),
        phraseNotMore: _t('No more members.'),
        className: 'poll-vote-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView,
        parseData: function(data, ItemModel) {

            var items = data.map(function(item) {
                return new ItemModel(item);
            });

            this.trigger('parsedatasuccess', items);

            return items;
        }
    });
});