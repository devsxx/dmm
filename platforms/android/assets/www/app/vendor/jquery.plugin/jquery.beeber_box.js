define(function(){
	var Beeber = function(boxView, indicator){
		this.isShown = false;
		
		this.boxView = boxView;
		
		var self = this;
		
		$(document).on('click', indicator, function(){
			console.log('clicked on ' + indicator);
			if(self.isShown){
				self.close();
			} else {
				self.open();
			}
		});
	}
	
	Beeber.prototype.open =  function(){
		
		if(true  == this.isShown ){
			return this.isShown = true;
		}
		
		utils.observer.trigger('beeber:before_open', this);
		
		this.isShown = true;
		
		this.view = new (this.boxView)();
		
		this.view.render().inject().open();	
		
	}
	
	Beeber.prototype.close = function(){
		
		if(false == this.isShown)
		{
			this.isShown = false;
		}
	
		this.view.close();
		
		this.isShown = false;
		
		utils.observer.trigger('beeber:after_close', this);
		
	}
	
	return Beeber;

});
