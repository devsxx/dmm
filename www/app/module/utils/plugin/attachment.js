define(function(){
	
	function Attachment(){
		this.proxy  = {}
	}
	
	Attachment.prototype.add = function(type, proxy)
	{
		if(typeof type == 'string'){
			this.proxy[type] = proxy;	
		}else if(typeof type == 'object'){
			for(var i =0; i<type.length; ++i){
				this.proxy[type[i]] = proxy;
			}
		}
	}
	
	Attachment.prototype.translate = function(type)
	{
		if(this.proxy.hasOwnProperty(type))
		{
			return this.proxy[type];
		}
		
		return false;
	}
	
	return new Attachment();
});
