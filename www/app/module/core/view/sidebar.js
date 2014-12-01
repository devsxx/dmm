define([
	'core/plugin/viewer',
	'core/collection/sidebar',
	'text!core/tpl/sidebar.html',
	'text!core/tpl/sidebar-list.html'
],function(viewer, SidebarCollection, text, text_list){
	
	
	var Configs  = Backbone.Model.extend({});
	
	return Backbone.View.extend({
		region: {
			outer: '#container',
			wrapper: '#sidebar',
			scroller: '#sidebar-content',
			listViewHolder: '#sidebar_list_holder'
		},
		id: 'sidebar-content',
		className :'sidebar-content swiper-container',
		events: {
			// 'click #link_logout': 'logout',
			'click .item': 'navigate',
			'click': 'hide'
		},
		cached : false,
		initialize: function(atts){
			this.menu_items = new SidebarCollection();
			this.viewer =  viewer;
			this.configs = new Configs({
				
			});
			
			var self  = this;




			this.menu_items.on('change',function(){
				self.updateView();
			});
			
			this.viewer.on('change',function(){
				self.fetchData();
			});
			
			this.isShown = false;
			
			utils.observer.on('sidebar:toggle',function(){
				self.toggle();
			})
			.on('beeber:pre_show',function(){
				if(self.isShown){
					self.hide();
				}
			})
			.on('router:changed',function(){
				if(self.isShown){
					self.hide();
				}
			});



			

            utils.observer.on('app:run',function(){
            	// Cache Implementation << Nay
				self.cached = localStorage.getItem('sidebar');
            	           if (self.cached) {
				                self.cached = JSON.parse(self.cached);
				                self.menu_items.reset();
								self.menu_items.add(self.cached);
								self.render().inject(); //Patched
								self.menu_items.trigger('change');
								//self.fetchDataComplete(self.cached);
				            }else {

				            		self.fetchData();
				            }

						
					});


		},
		template: _.template(text),
		listTpl: _.template(text_list),
		show:function(){
			utils.observer.trigger('sidebar:pre_show');
			this.$outer.addClass('sidebar-open');
			this.isShown = true;
		},
		hide: function(){
			this.isShown = false;
			this.$outer.removeClass('sidebar-open');
		},
		toggle: function(){
			if(this.isShown){
				this.hide();
			}else{
				this.show();
			}
		},
		fetchData: function(){
			utils.api.get('core/sidebar',{},{context: this})
			.done(this.fetchDataComplete)
			.fail(this.fetchDataFail)
			;
		},
		fetchDataComplete: function(data){
			this.menu_items.reset();
			this.menu_items.add(data);
			this.menu_items.trigger('change');
			//cached << Nay 
			localStorage.setItem('sidebar', JSON.stringify(data));
		},
		fetchDataFail: function(){
			// silent
		},
		navigate: function(evt){

            // lost connection
            if (Backbone.history.fragment == 'lost-connection') {
                return;
            }

            if(!evt) return false;

			evt.preventDefault();

			var ele = $(evt.currentTarget)
			  , href  = ele.data('href')
			  , id = ele.data('id');
			  
			if(href == '#logout'){
				utils.modal.confirm(_t('Do you want to log out of application?'),function(result){
					if(result == 1){
						window.location.href  = '#logout';
					}
				}, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
				return false;
			}
			  
			if(!href){
				return false;
			}
			
			// remove old active class
			this.$el.find('.active').removeClass('active');
			
			if(id)
			{
				ele.addClass('active');
				localStorage.getItem('sidebar.active')
			}
			
			this.hide();
			window.location.href=href;
		},
		render: function(context){
			
			this.$el.html(this.template());
			
			this.$scroller =  this.$el.find(this.region.scroller);
			
			this.$listView  = this.$el.find(this.region.listViewHolder);
			
			this.$outer  =  $(this.region.outer);
	
			
			return this;
		},
		inject: function(){

			$(this.region.wrapper).html(this.$el);
			
			
			this.swiperObj  = new Swiper('#sidebar-content', {
				scrollContainer: true,
				mode: 'vertical'
			});
			
			this.$scroller.on('click',function(){
				utils.observer.trigger('sidebar:close');
			});
			
			var self = this;
			
			$('#backdrop').on('click',function(){
				self.isShown && self.hide();
			});
			
			return this;
		},
		updateView: function(){

			this.$listView.html(this.listTpl({
				menu_items: this.menu_items,
				module: 'new_feed',
				configs: this.configs,
				viewer: this.viewer
			}));

			this.swiperObj.reInit();
		}
	});
});
