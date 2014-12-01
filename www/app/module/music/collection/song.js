define([
	'music/model/song'
],function(SongModel){
	return Backbone.Collection.extend({
		model: SongModel
	});
});
