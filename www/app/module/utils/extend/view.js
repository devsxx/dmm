define(function(){
	
	/**
	 * asgin main content of updater
	 */
	Backbone.View.prototype.region = {};
	
	/**
	 * render context
	 */
	Backbone.View.prototype.context = {};
	
	
	/**
	 * inject view to data storage.
	 */
	Backbone.View.prototype.inject = function(){
		
	}
	
	Backbone.View.prototype.setRegion = function(region){
		
		this.region = $.extend({}, this.region, region);
		
		return this;
	}
	
	Backbone.View.prototype.topMenuIsShown = function(value){
		if(arguments.length){
			this._topMenuIsShown = value;
		}else{
			 return this._topMenuIsShown || false;
		}
	}
});
