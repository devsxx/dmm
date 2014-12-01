define(function(){
	
	return  {
	    translate: function (sec) {
	        if (sec < 60) {
	            return "Seconds ago";
	        }
	
	        if (sec < 3600) {
	            var main = parseInt(sec / 60, 10);
	            return main + " minute ago";
	        }
	
	        if (sec < 86400) {
	            var main = parseInt(sec / 3600, 10);
	            return main + " hours ago";
	        }
	
	        if (sec < 2592000) {
	            var main = parseInt(sec / 86400, 10);
	            return main + " days ago";
	        }
	
	        if (sec < 946080000) {
	            var main = parseInt(sec / 2592000, 10);
	            return main + " months ago";
	        }
	
	        var main = parseInt(sec / 946080000, 10);
	        return main + " year ago";
	
	    },
	    update: function () {
	        var now = parseInt((new Date()).getTime() / 1000);
	
	        $('.livetimestamp').each(function (index, ele) {
	            var utime = parseInt($(this).data('utime'), 10);
	            var sec = now - utime;
	            if (isNaN(sec) || sec < 0) {
	                return;
	            }
	
	            $(this).html($Livetime.translate(sec));
	        });
	    },
	    convert: function(timestamp){
	    	var now = parseInt((new Date()).getTime() / 1000);
	    	var utime = parseInt(timestamp, 10);
	    	var sec = now - utime;
            if (isNaN(sec)) {
                return '';
            }
            
            return this.translate(sec);
	    }
	}
});
