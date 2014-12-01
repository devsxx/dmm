define([
	'text!activity/tpl/attachment-checkin.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'attachment-checkin',
		template: _.template(text),
		render: function(){
			var feed = this.model;
			var checkin = feed.getAttachments()[0];
			var width  = $('.item-attachment').width();
			
			if(constants.isTablet){
				width = width - 32;
			}
			//var height = screen.height * 0.25;
			// fix height because issue of swiper need to caculate height of view port
			var height = 160;
			
			
			var imgSrc = 'http://maps.googleapis.com/maps/api/staticmap?center=' + checkin.fLatitude + ',' + checkin.fLongitude +
                '&zoom=15&size=' +width +'x'+height +
                '&maptype=roadmap&markers=color:red%7C' + checkin.fLatitude + ',' + checkin.fLongitude + '&sensor=false';
			
			this.$el.html(this.template({feed:feed,checkin: checkin, imgSrc: imgSrc, width: width, height: height }));	
			
			return this;	
		},
		inject: function(dom){
			dom.html(this.$el);
			return this;
		}
	});
});
