define([
	'event/model/event'
], function (Model) {
	var Collection = Backbone.Collection.extend({
		model: Model
	});
	
	return Collection;
});
