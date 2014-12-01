define([
	'user/model/user'
],function(Model){
	return Backbone.Collection.extend({
		model: Model
	});
});