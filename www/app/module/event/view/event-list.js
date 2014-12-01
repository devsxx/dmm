define([
	'event/model/event',
	'event/view/event-item',
	'text!event/tpl/event-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			sView: 'all',
			iPage: 1,
			sSearch: '',
			iCatSearch: 'all_cate',
			iAmountOfevent: 5
		},
		followById: false,
		api: 'event/get',
		phraseNotFound: 'No events found.',
		phraseNotMore: 'No more events.',
		className: 'event-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView
	});
});
