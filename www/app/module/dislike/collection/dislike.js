define([
	'dislike/model/dislike'
], function (Model) {
	return Backbone.Collection.extend({
		model: Model
	});
});
