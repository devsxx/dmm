define([
	'text!photo/tpl/album-item.html',
],function(text){
	
	return Backbone.ItemView.extend({
		className: 'photo-album-item',
        moduleId: 'photo/view/album-item',
		template: _.template(text),
		render: function(){
			
			this.$el.attr("id",this.model.getDataId());
            this.$el.html(this.template({item: this.model}));
			return this;
		},
		events: {},
		inject: function(inject){
			
			inject(this.$el);
			
			var width = this.$el.find('.item-wrapper').first().width();
			
			this.$el.find('.item-image').css({width: width});
			
			var container = this.$el.find('.swiper-container');
			
			container.swiper({
				scrollContainer: false,
				mode: 'horizontal',
				slidesPerView: 'auto',
				slidesPerViewFit: true,
				visibilityFullFit: true,
			});
			
			// container.trigger('refresh');
		}
	});
});
