define([
	'comment/model/comment'
],function(comment){
	return Backbone.Collection.extend({
		model: comment
	});
});
