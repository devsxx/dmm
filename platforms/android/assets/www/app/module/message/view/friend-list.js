define([
    'message/model/friend',
    'message/view/friend-item',
    'text!message/tpl/friend-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iAmountOfFriend: 20,
            iPage: 1,
        },
        followById: false,
        api: 'message/fetchfriend',
        phraseNotFound: 'No friends found.',
        phraseNotMore: 'No more friends.',
        tagName: 'ul',
        className: 'autocomplete shadow',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView,
        parseData: function(data, ItemModel) {
            var self = this;
            return data.map(function(item) {
                item.sSearch = self.query.sSearch;
                return new ItemModel(item);
            });
        }
    });
});