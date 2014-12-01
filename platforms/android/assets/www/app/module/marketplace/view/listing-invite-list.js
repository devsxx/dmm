define([
    'marketplace/view/listing-invite-item',
    'text!marketplace/tpl/listing-invite-list.html',
    'user/model/user',
], function(ItemView, text, Model) {

    return Backbone.ListView.extend({
        defaults: {
            iListingId: 0
        },
        followById: false,
        api: 'marketplace/getinvitepeople',
        phraseNotFound: 'No friends found.',
        phraseNotMore: 'No more friends.',
        className: 'friend-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});