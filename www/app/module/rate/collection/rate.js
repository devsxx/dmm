define([
	'rate/model/rate'
],function(RateModel){
	return Backbone.Collection.extend({
		model: RateModel
	});
});
