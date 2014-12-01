define([
	'text!music/tpl/playlist-list.html',
	'music/model/playlist',
	'music/view/playlist-item',
],function(text, Model, ItemView)
{
	
	return Backbone.ListView.extend({
		defaults: {
			sSearch: '',
			sView: 'all',
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

