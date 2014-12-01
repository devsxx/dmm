define([
	'photo/model/album',
	'photo/view/album-item',
	'text!photo/tpl/album-list.html',
    'photo/ipad/view/album-list'
],function(Model, ItemView, text){


	return Backbone.ListView.extend({
		defaults: {
			sView: '',
			iPage: 1,
			sSearch: '',
			sOrder: 'latest',
			// iUserId: null,
			iCategoryId: 0,
			iAmountOfAlbum: 8 // 2 x 4 item 
		},
        moduleId: 'photo/view/album-list',
		followById: false,
		api: 'photo/filter_album',
		phraseNotFound: 'အယ္လဘမ္ မေတြ.ပါ။',
		phraseNotMore: 'ေနာက္ထပ္ အယ္လဘမ္ မေတြ.ပါ။',
		className: 'photo-album-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
