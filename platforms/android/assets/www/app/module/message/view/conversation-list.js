define([
	'message/model/conversation',
	'message/view/conversation-item',
	'text!message/tpl/conversation-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			iPage: 1,
			sSearch: '',
			iCategoryId: 0,
			iAmountOfMessage: 10 // for tablet load 10 items to full screen.
		},
		followById: false,
		api: 'message/fetch',
		phraseNotFound: 'စာတုိ မရွိပါ',
		phraseNotMore: 'ေနာက္ထပ္ စာတုိ မရွိပါ။',
		className: 'conversation-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
