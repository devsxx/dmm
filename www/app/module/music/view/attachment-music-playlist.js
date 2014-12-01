define([
	'text!music/tpl/attachment-music-playlist.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'attachment-music-playlist',
		template: _.template(text),
		render: function(){
			
			var item = this.model;
			var att = item.getAttachments()[0];
			
			var context = {
				item: item,
				attachment: att,
				photoUrl: att.sPhoto_Url || att.sFeedIcon,
				title: att.sTitle,
				description: att.sDescription,
				linkUrl: '#music_song/' + att.iId
			};
			
			this.$el.html(this.template(context));
			
			return this;
		},
		inject: function(dom){
			dom.html(this.el);
		}
	});
});
