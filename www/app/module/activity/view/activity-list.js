define([
	'activity/model/feed',
	'activity/view/activity-item',
	'text!activity/tpl/activity-list.html',
],function(Model, ItemView, text){
	
	return Backbone.ListView.extend({
		defaults: {
			iPage: 0,
			iAmountOfFeed: 5,
			iMinId: 0,
			iMaxId: 0
		},
		followById: true,
		api: 'feed/fetch',
		phraseNotFound: _t('လႈပ္ရွားမႈမ်ား မရွိပါ။'),
		phraseNotMore: _t('လႈပ္ရွားမႈမ်ား မရွိပါ။'),
		className: 'activity-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
