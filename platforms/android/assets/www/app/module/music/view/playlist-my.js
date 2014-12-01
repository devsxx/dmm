define([
	'text!music/tpl/playlist-my.html',
	'music/view/playlist-my-list',
	'music/view/playlist-search'
],function(text){
	
	var ListView	= require('music/view/playlist-my-list')
	  , SearchView	= require('music/view/playlist-search'); 
	
	return Backbone.View.extend({
		region: {
			holder: '#main',
			scroller: '#content'
		},
		template: _.template(text),
		initialize: function(){
			
		},
		render: function(){
			
			this.$el.html(this.template());
			
			return this;
			
		},
		inject: function(){
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView  = new ListView({}, this.$el.find('#playlist_list_view_holder'), this.$scroller);
			
			this.searchView = new SearchView();
			
			this.searchView.render().inject();
			
			// render list view
			this.listView.render({}).inject();
			
			var self = this;
			
			this.searchView.on('submit', function(data){
				self.listView.resetQuery(data);
			});
			
			return this;
		}
	});
});
