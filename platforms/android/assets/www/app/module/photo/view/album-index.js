define([
	'core',
	'text!photo/tpl/album-index.html',
	'photo/view/album-list',
	'photo/view/album-search',
    'photo/view/photo-more-menu'
],function(core, text){
	
	var ListView = require('photo/view/album-list')
	  , SearchView = require('photo/view/album-search')
      , MoreMenuView = require('photo/view/photo-more-menu');
	
	return Backbone.View.extend({
		region: {
			holder: '#main',
			scroller: '#content'
		},
		template: _.template(text),
		initialize: function(){
			
		},
		render: function(query){
			
			this.query =  $.extend({
				iViewerId: core.viewer.getId(),
				iUserId: 0
			}, query);
			
			this.$el.html(this.template(this.query));
			
			return this;
			
		},
		inject: function(){
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView  = new ListView({}, 
				this.$el.find('#album_list_view_holder'),
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
		},
        events: {
            'click #footer_more_btn': 'showMoreMenu'
        },
        showMoreMenu: function (evt) {
            this.moreMenu = new MoreMenuView();
            this.moreMenu.render().inject();
        }
	});
});
