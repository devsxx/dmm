define([
	'text!message/tpl/attachment/album_photo.html',
	'text!message/tpl/attachment/core_link.html',
	'text!message/tpl/attachment/music_playlist_song.html',
	'text!message/tpl/attachment/video.html'
],function(){
	
	var tpl = {
		album_photo 		: require('text!message/tpl/attachment/album_photo.html'),
		advalbum_photo		: require('text!message/tpl/attachment/album_photo.html'),
		core_link 			: require('text!message/tpl/attachment/core_link.html'),
		music_playlist_song : require('text!message/tpl/attachment/music_playlist_song.html'),
		video 				: require('text!message/tpl/attachment/video.html')
	};
	
	return Backbone.View.extend({
		region: {},
		template: null,
		render: function(item){
			
			this.template = _.template(tpl[item.sType]);
			
			this.$el.addClass("attachment_" + item.sType);
			this.$el.html(this.template({item: item}));
			
			return this;
		}
	});
});
