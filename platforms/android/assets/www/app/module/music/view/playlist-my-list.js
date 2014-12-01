define([
	'text!music/tpl/playlist-my-list.html',
	'music/model/playlist',
	'music/view/playlist-my-item',
	'search/view/search'
],function(text, Model, ItemView, searchView)
{
	return Backbone.ListView.extend({
		defaults: {
			sSearch: '',
			sView: 'my',
            iMaxId: 0,
            iMinId: 0,
            iLimit: 5,
            iPage: 1
		},
		followById: true,
		api: 'album/fetch',
		phraseNotFound: 'အယ္လဘမ္ မေတြ.ပါ',
		phraseNotMore: 'အယ္လဘမ္ မေတြ.ပါ',
		className: 'music-playlist-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});

