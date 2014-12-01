define([
	'request/model/request'
],function(RequestModel){
	return Backbone.Collection.extend({
		model: RequestModel
	});
});
