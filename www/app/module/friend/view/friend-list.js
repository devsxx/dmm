define([
	'friend/model/friend',
	'friend/view/friend-item',
	'text!friend/tpl/friend-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			sAction: "all",
            iAmountOfFriend: 20,
            iPage: 1
		},
		followById: false,
		api: 'friend/get',
		phraseNotFound: 'No friends found.',
		phraseNotMore: 'No more friends.',
		className: 'friend-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
