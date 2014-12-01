define(function(){
	
	var Headline = function(){
		this.proxy = {};
	}
	
	Headline.prototype.add = function(type, proxy){
		if(typeof type == 'string'){
			this.proxy[type] = proxy;	
		}else if(typeof type == 'object'){
			for(var i =0; i<type.length; ++i){
				this.proxy[type[i]] = proxy;
			}
		}
		
	}
	
	Headline.prototype.translate = function(feed)
	{
		var type = feed.getActionType();
		
		if(this.proxy.hasOwnProperty(type)){
			return this.proxy[type](feed);
		}
		
		return this._default(feed);
	}
	
	Headline.prototype._default = function(feed){
		// return feed.getPosterLink();
		return ''; //minhTA, in Fox, it should be empty by default
	}
	
	return new Headline();
});
