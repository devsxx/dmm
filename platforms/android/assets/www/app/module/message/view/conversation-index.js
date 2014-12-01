define([
	'text!message/tpl/conversation-index.html',
	'message/view/conversation-list',
	'message/view/conversation-search'
],function(text){
	
	var ListView = require('message/view/conversation-list')
	  , SearchView = require('message/view/conversation-search'); 
	
	return Backbone.View.extend({
		region: {
			holder: '#main',
			scroller: '#content'
		},
		template: _.template(text),
		initialize: function(){
			
		},
		render: function(query){
			
			this.query  = $.extend({}, {filter: 'inbox'}, query);
			
			this.$el.html(this.template(this.query));
			
			return this;
			
		},
		inject: function(){
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView  = new ListView({}, 
				this.$el.find('#conversation_list_view_holder'),
				this.$scroller,
				{
					loadmore: true,
					loadnew: true,
				});
			
			this.searchView = new SearchView();
			
			this.searchView.render().inject();
			
			// render list view
			this.listView.render(this.query).inject();
			
			var self = this;
			
			this.searchView.on('submit', function(data){
				
				var query = $.extend({}, self.query, data);
				
				self.listView.resetQuery(query);
			});
			
			return this;
		}
	});
});
