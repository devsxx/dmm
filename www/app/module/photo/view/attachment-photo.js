define([
	'text!photo/tpl/attachment-photo.html',
    'photo/model/photo'
],function(text){
	
    var PhotoModel = require('photo/model/photo')
	
	return Backbone.View.extend({
		className: 'attachment-photo',
		template: _.template(text),
		count: 0,
		render: function(){
			var item = this.model;
			
			var attachments = item.getAttachments();
			
            attachments = attachments.map(function(attachment) {
				if (!parseInt(attachment.iAlbumId)) {
					attachment.iParentId = item.get('iObjectOwnerId');
					attachment.sParentType = item.get('sObjectOwnerType');
				}
                return new PhotoModel(attachment);
            });
            
			var count = this.count  = attachments.length;
			var limit = utils.setting.get('mfox_limit_photo_to_scroll');
            if (limit > 0) {
                attachments = attachments.slice(0, limit);
            }
            
			this.$el.html(this.template({item: this.model, attachments: attachments,count: count, elementId: $.newElenentId() }));
			
			return this;
		},
		inject: function(dom){
			
			dom.html(this.el);
			
			if(this.count > 1){
				
				var container = $(dom).find('.swiper-container');

				var item_width = container.width();

				// add width fix slideshow width content
				container.find('.attachment-photo-item').css({ width: item_width });
				
				// check and add class for album photo
				container.addClass('swiper-album-photo');
				
				container.swiper({
					// scrollContainer: true,
					mode: 'horizontal',
					slidesPerView: 'auto'
				});
				
				container.trigger('refresh');
			}
			
			return this;
		}
	});
});
