define([
	'comment/model/comment'
],function(CommentModel){
	return Backbone.Collection.extend({
		model: CommentModel
	});
});
