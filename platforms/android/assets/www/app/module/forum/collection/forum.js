define([
	'forum/model/forum'
], function (Model) {
	return Backbone.Collection.extend({
		model: Model
	});
});
