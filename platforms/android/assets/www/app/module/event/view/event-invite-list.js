define([
	'user/model/user',
	'event/view/event-invite-item',
	'text!event/tpl/event-invite-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			iEventId: 0,
            sAction: "all",
            amountOfFriend: "9999",
            LastFriendIdViewed: "0"
		},
		followById: false,
		api: 'event/getinvitepeople',
		phraseNotFound: 'No friends found.',
		phraseNotMore: 'No more friends.',
		className: 'friend-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});

