define([
	'text!music/tpl/song-list.html',
	'music/model/song',
	'music/view/song-item',
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
		api: 'song/fetch',
		phraseNotFound: 'သီခ်င္း မေတြ.ပါ',
		phraseNotMore: 'သီခ်င္း မေတြ.ပါ',
		className: 'music-song-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView,
        init: function() {
            if(this.settings.sView) {
                this.defaults.sView = this.settings.sView;
            }
        }
	});
});

