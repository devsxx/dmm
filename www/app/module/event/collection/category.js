define([
	'event/model/category'
], function(Model){
	
	return Backbone.Collection.extend({
		model: Model
	});
	
});
