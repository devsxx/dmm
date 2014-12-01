define([
	'text!user/tpl/user-detail-album.html',
	'photo/view/album-list',
], function(text, ListView){
	
	return Backbone.PolyplatformView.extend({
		template: _.template(text),
		region: {
			wrapper: '#main',
			scroller: '#content',
			albumListHolder: '#photo_list_view_holder'
		},
		render: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			this.$scroller = this.$el.find(this.region.scroller);
			
			this.$albumListHolder =  this.$el.find(this.region.albumListHolder);
			
			return this;
		},
		inject: function(){
			
			$(this.region.wrapper).html(this.$el);
				
			this.$scroller.ensureVerticalScroll();
						
			this.listView  = new ListView({},
				this.$albumListHolder,
				this.$scroller, 
				{});
				
			this.listView.render({
                bIsUserProfile: true,
                iUserId: this.model.getId()
            }).inject();
			
			return this;
		}
	});
});
