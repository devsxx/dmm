define([
	'forum/model/post'
], function (Model) {
	return Backbone.Collection.extend({
		model: Model
	});
});
