define([
	'utils/plugin/popup',
],function() {
	
	Backbone.TopMenuView = Backbone.View.extend({
		region: {
			holder: '#top_menu_holder'
		},
		template: null, // need to be over write
        render: function(){
        	
        	this.$holder = $(this.region.holder);
        	
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		inject: function(){
			if(constants.isTablet){
				utils.popup.open(this.$el);	
			}else {
				this.$holder.html(this.$el);
				
				this.$holder.removeClass('hide');
			}
			
			return this;
		},
		hide: function(){
			if(constants.isTablet){
				utils.popup.close();
			}else{
				this.$holder.addClass('hide');
				this.$el.remove();
			}
			return this;
		}
	});
	
	
	function TopMenuUtils() {
		
		this._topMenuView  = false;
		
		this.toggle = function(view, model) {
			// top menu
			if (constants.isTablet || !view.topMenuIsShown()) {
				
				view.topMenuIsShown(true);
				
				this._topMenuView  = new view.topMenuView({model: model}).render().inject();
				
			} else{
				
				view.topMenuIsShown(false);
				
				if(this._topMenuView){
					
					this._topMenuView.hide();	
					
					this._topMenuView = false;
				}
			}
		}
	}
	
	return new TopMenuUtils();
});
