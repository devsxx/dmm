define(function(){
	
	if(Debug){
		return {
			log: function(){
				console.log.apply(console, arguments);
			},
			info: function(){
				console.info.apply(console, arguments);
			},
			error: function(){
				console.error.apply(console, arguments);
			},
			warn: function(){
				console.warn.apply(console, arguments);
			}
		}
	}
	
	var empty = function(){}
	
	return {
		log: empty,
		info: empty,
		error: empty
	}
});
