define(['photo/model/photo'], function(PhotoModel){
	
	return Backbone.Collection.extend({
		model: PhotoModel
	});
});