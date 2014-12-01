define([
	'text!music/tpl/song-index.html',
	'music/view/song-list',
	'music/view/song-search'
],function(text){
	
	var ListView	= require('music/view/song-list')
	  , SearchView	= require('music/view/song-search'); 
	
	return Backbone.View.extend({
		region: {
			holder: '#main',
			scroller: '#content'
		},
		template: _.template(text),
	
		render: function(param){
            this.sView = (param && param.sView) ? param.sView : 'all' ;
			
			this.$el.html(this.template({
                sView: this.sView
            }));
			
			return this;
			
		},
		inject: function(param){


			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView  = new ListView({},this.$el.find('#song_list_view_holder'), this.$scroller,{
                loadnew: false,
                sView: this.sView
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

