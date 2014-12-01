define([
	'request/model/request',
	'text!request/tpl/request-box-list.html',
],function(Model, text){

	return Backbone.ListView.extend({
		defaults: {
			sView: 'all',
			iPage: 1,
			sSearch: '',
			iCategory: 0,
			iAmountOfVideo: 5
		},
		followById: false,
		api: 'notification/friendrequested',
		phraseNotFound: 'သူငယ္ခ်င္းအျဖစ္ေတာင္းဆုိမွုမရွိပါ။',
		phraseNotMore: 'ေနာက္ထပ္ သူငယ္ခ်င္းေတာင္းဆုိမွုမရွိပါ။',
		className: 'friend-reques-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: null,
		handleInjectItem: function(item, callback){
			var ProxyView = utils.requestProxy.get(item);
			if(!ProxyView){
				return;
			}
			// append if does not exist
			if (this.$el.find('#request_item_' + item.getPosterId()).length == 0) {
				new ProxyView({model: item}).render().inject(callback);
			}
		}
	});
});
