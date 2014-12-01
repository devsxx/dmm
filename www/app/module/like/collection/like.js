define([
	'like/model/like'
], function(LikeModel){
	return Backbone.Collection.extend({
		model: LikeModel
	});
});
