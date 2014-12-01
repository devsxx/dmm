define([
	'photo/model/photo',
	'photo/view/photo-my-item',
	'text!photo/tpl/photo-my-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			iPage: 1,
			iInDetails: 1,
			sOrder: "latest",
			iAmountOfPhoto: 12 // 4 rows, 3 photos per rows
		},
		followById: false,
		api: 'photo/my',
		phraseNotFound: 'ဓာတ္ပံု မရွိပါ။',
		phraseNotMore: 'ဓာတ္ပံု မရွိပါ။',
		className: 'clearfix photo-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView,
        parseData: function(data, ItemModel) {
			return data.map(function(item){
                item.iParentId = Backbone.iUserId;
                item.sParentType = 'profile_photo';
				return new ItemModel(item);
			});
        }
	});
});
