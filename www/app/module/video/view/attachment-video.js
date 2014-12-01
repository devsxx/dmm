define([
	'text!video/tpl/attachment-video.html'
],function(text){
	return Backbone.View.extend({
		region: {},
		className: 'attachment-video',
		template: _.template(text),
		render: function(){
			
			var item = this.model;
			
			var video = item.getAttachments()[0];
			
			var duration = numeral(video.iDuration).format('00:00').replace(/^0:/,'');
			
			var fromDomain = video.sOriginalLink_Url;
			
			if(fromDomain=='www.uploaded.com'){
				fromDomain = '';
			}
			
			this.$el.html(this.template({feed:item,video:video, duration: video.sDuration || duration, fromDomain: fromDomain}));
			
			this.$el.attr({rel: 'link','data-url':'#' + video.sType + '/' + video.iId});
			
			return this;
		},
		inject: function(dom){
			dom.html(this.$el);
		}
	});
});
