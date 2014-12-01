define([
	'core',
	'text!photo/tpl/album-my.html',
	'photo/view/album-my-list',
    'photo/view/photo-more-menu'
],function(core, text){
	
	var ListView = require('photo/view/album-my-list')
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
			
			this.query =  $.extend({iUserId: 0}, query);
			
			this.$el.html(this.template(this.query));
			
			return this;
			
		},
		inject: function(){
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			
			this.listView  = new ListView({}, 
				this.$el.find('#album_my_list_view_holder'),
				this.$scroller,
				{
					loadmore: true,
					loadnew: false,
				});
			
			// render list view
			this.listView.render({}).inject();
			
			var self = this;
			
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
