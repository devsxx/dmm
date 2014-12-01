define(function(){
	
	function ProxyView(){
		this.proxy  = {}
	}
	
	ProxyView.prototype.add = function(type, proxy)
	{
		if(typeof type == 'string'){
			this.proxy[type] = proxy;	
		}else if(typeof type == 'object'){
			for(var i =0; i<type.length; ++i){
				this.proxy[type[i]] = proxy;
			}
		}
	}
	
	ProxyView.prototype.get = function(item)
	{	
		var type = item.getRequestType();
		if(this.proxy.hasOwnProperty(type))
		{
			return this.proxy[type];
		}
		return false;
	}
	
	return new ProxyView
});
