define(function(){
	return Backbone.Model.extend({
		idAttribute: 'iCategoryId',
		defaults: {
			'sModelType': 'event_category'
		}
	});
});
