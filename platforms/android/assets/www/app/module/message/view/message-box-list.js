define([
	'message/model/conversation',
	'message/view/message-box-item',
	'text!message/tpl/message-box-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			sView: 'all',
			iPage: 1,
			sSearch: '',
			iCategory: 0,
			iAmountOfMessage: 10, // set 10 items in tablet.
		},
		followById: false,
		api: 'message/inbox',
		phraseNotFound: 'စာတုိ မရွိပါ။',
		phraseNotMore: 'ေနာက္ထပ္ စာတုိ မရွိပါ။',
		className: 'box-conversation-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
