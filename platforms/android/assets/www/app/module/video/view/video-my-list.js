define([
	'video/model/video',
	'video/view/video-item',
	'text!video/tpl/video-my-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			sView: 'my',
			iPage: 1,
			sSearch: '',
			iCategory: 0,
			iAmountOfVideo: 5
		},
		api: 'video/search',
		phraseNotFound: 'ဗြီဒီယို မရွိပါ။',
		phraseNotMore: 'ေနာက္ထပ္ ဗြီဒီယို မရွိပါ။',
		className: 'video-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
