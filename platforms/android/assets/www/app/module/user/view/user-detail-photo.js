define([
	'text!user/tpl/user-detail-photo.html',
	'photo/view/photo-list'
], function(text, ListView){
	
	return Backbone.View.extend({
		region: {
			wrapper: '#main',
			scroller: '#content',
			photoListHolder: '#photo_list_view_holder'
		},
		template: _.template(text),
		render: function(query){
			
			this.$el.html(this.template({item: this.model}));
			
			this.$scroller = this.$el.find(this.region.scroller);
			
			this.$photoListHolder = this.$el.find(this.region.photoListHolder);
			
			return this;
		},
		inject: function(){
			
			$(this.region.wrapper).html(this.$el);
				
			this.$scroller.ensureVerticalScroll();
						
			this.listView  = new ListView({},
				this.$photoListHolder,
				this.$scroller, 
				{
                    iParentId: this.model.getId(),
                    sParentType: 'profile_photo'
                });
                
			this.listView
			.render({
                bIsUserProfile: true,
                iUserId: this.model.getId()
            })
			.inject();
			
			return this;
		}
	});
});
