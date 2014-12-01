define([
	'text!friend/tpl/friend-index.html',
	'friend/view/friend-list',
	'friend/view/friend-search',
], function(text, ListView, SearchView) {
	
	return Backbone.View.extend({
		region: {
			wrapper: '#main',
			scroller: '#content',
			listViewHolder: '#friend_list_view_holder'
		},
		template : _.template(text),
		render : function(query) {
			
			this.query 			= $.extend({}, query);
			
			this.$el.html(this.template(this.query));
			
			this.$scroller 			= this.$el.find(this.region.scroller);
			this.$listViewHolder  	= this.$el.find(this.region.listViewHolder);
			
			return this;
		},
		inject: function(){
			
            var self = this;
            
			$(this.region.wrapper).html(this.$el);
			
			var useSwiper   =  constants.os_version < '30';
			this.$scroller.ensureVerticalScroll(useSwiper);
			
			this.searchView = new SearchView();
            
            this.searchView.render().inject();
			
            this.searchView.on('submit', function(data){
				
				var query = $.extend({}, self.query, data);
				
				self.listView.resetQuery(query);
			});
			
			this.listView  = new ListView({}, 
				this.$listViewHolder,
			 	this.$scroller,
			  	{loadmore: true, loadnew: false}
            );
			 
            this.listView.render(this.query).inject();
            
			return this;
		}
	});
});
