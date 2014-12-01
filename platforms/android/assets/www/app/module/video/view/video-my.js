define([
	'text!video/tpl/video-my.html',
	'video/view/video-my-list',
	'video/view/video-search'
],function(text){
	
	var ListView = require('video/view/video-my-list')
	  , SearchView = require('video/view/video-search'); 
	
	return Backbone.View.extend({
		region: {
			main: '#main',
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
			
			var main = $(this.region.main).html(this.$el);
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller)
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView  = new ListView({}, 
				this.$el.find('#video_list_view_holder'),
				this.$scroller,
				{
					loadmore: true,
					loadnew: false,
				});
			
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
