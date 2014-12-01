define([
	'share/model/share'
],function(ShareModel){
	return Backbone.Collection.extend({
		model: ShareModel
	});
});
