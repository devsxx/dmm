define([
	'message/model/message',
	'message/view/message-item',
	'text!message/tpl/message-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			iPage: 1,
		},
		followById: false,
		api: 'message/detail',
		phraseNotFound: 'စာတုိ မရွိပါ။',
		phraseNotMore: 'ေနာက္ထပ္ စာတုိ မရွိပါ။',
		className: 'message-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
