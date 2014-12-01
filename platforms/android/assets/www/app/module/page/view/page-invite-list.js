define([
    'user/model/user',
    'page/view/page-invite-item',
    'text!page/tpl/page-invite-list.html'
],function(Model, ItemView, text){

    return Backbone.ListView.extend({
        defaults: {
            iPageId: 0,
            sAction: "all",
            amountOfFriend: "999",
            LastFriendIdViewed: "0"
        },
        followById: false,
        api: 'pages/getinvitepeople',
        phraseNotFound: 'No friends found.',
        phraseNotMore: 'No more friends.',
        className: 'friend-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});

