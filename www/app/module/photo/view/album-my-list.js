define([
	'photo/model/album',
	'photo/view/album-my-item',
	'text!photo/tpl/album-my-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			sView: '',
			iPage: 1,
			sSearch: '',
			sOrder: 'recent',
			iUserId: null,
			iCategoryId: 0,
			iAmountOfAlbum: 8 // 2 x4 items
		},
		followById: false,
		api: 'photo/myalbum',
		phraseNotFound: 'အယ္လဘမ္ မေတြ.ပါ။',
		phraseNotMore: 'ေနာက္ထပ္ အယ္လဘမ္ မေတြ.ပါ။',
		className: 'album-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});