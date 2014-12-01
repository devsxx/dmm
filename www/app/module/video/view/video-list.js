define([
	'video/model/video',
	'video/view/video-item',
	'text!video/tpl/video-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			sView: 'all',
			iPage: 1,
			sSearch: '',
			iCategory: 0,
			iAmountOfVideo: 5,
			sOrder: 'creation_date',
		},
		followById: false,
		api: 'video/search',
		phraseNotFound: 'ဗြီဒီယို မရွိပါ။',
		phraseNotMore: 'ေနာက္ထပ္ ဗြီဒီယို မရွိပါ။',
		className: 'video-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
