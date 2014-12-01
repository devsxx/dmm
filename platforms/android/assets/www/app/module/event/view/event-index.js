define([
	'text!event/tpl/event-index.html',
	'event/view/event-list',
	'event/view/event-search'
],function(text){
	
	var ListView = require('event/view/event-list')
	  , SearchView = require('event/view/event-search'); 
	
	return Backbone.View.extend({
		region: {
			holder: '#main',
			scroller: '#content'
		},
		template: _.template(text),
		initialize: function(){ },
		render: function(query){
			
			this.query  = $.extend({sView: 'upcoming'}, query);
			
			this.$el.html(this.template(this.query));
			
			return this;
			
		},
		inject: function(){
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView  = new ListView({},this.$el.find('#event_list_view_holder'), this.$scroller);
			
			this.searchView = new SearchView();
			
			this.searchView.render({sView: this.query.sView}).inject();
			
			// render list view
			this.listView.render(this.query).inject();
			
			var self = this;
			
			this.searchView.on('submit', function(data){
				self.listView.resetQuery($.extend({}, self.query, data));
			});
			
			return this;
		}
	});
});
