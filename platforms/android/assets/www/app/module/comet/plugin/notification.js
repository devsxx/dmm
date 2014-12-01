define([
    'core',
    'comet/collection/chat'
],function(){
    var core = require('core')
      , $popupChat = $('#popup-chat')
      , ChatCollection = require('comet/collection/chat')
    
    localStorage.setItem('cometchat_notification','');

	utils.observer.on('comet:turn-on-notification', function($ele, evt){
       localStorage.setItem('cometchat_notification','1');
        $('#popup-chat').show();
	});
    
	utils.observer.on('comet:turn-off-notification', function($ele, evt){
        localStorage.setItem('cometchat_notification','');
        $('#popup-chat').hide();
	});

    utils.observer.on('comet:update-notification', function(collection) {
        var total = 0;
        _.each(collection.models, function(item) {
            if(item.getNumberUnreadMesssages() > 0) {
                total += 1;
            }
        }, this)
        $('#popup-chat').find('span').html(total);
    });

    var checkToEnableOCN = function() {
    	var nof = !!localStorage.getItem('cometchat_notification');
    	if(nof){
            $('#popup-chat').show();
        }else{
        	  $('#popup-chat').hide();
        }
    }


    $popupChat.on('click', function() {
        // utils.observer.trigger('chat:show-latest-conversation');
        window.location.href = '#cometchat';
        setTimeout(function() {
            utils.observer.trigger('comet:show-latest-conversation');
        }, 200);
    });
    
    utils.observer.on('user:logout',function(){
        utils.observer.trigger('comet:turn-off-notification');
    	// window.clearInterval(interval);
    })

    utils.observer.on('user:login',function(){
        checkToEnableOCN();
    })

    document.addEventListener('offline', function() {
        utils.observer.trigger('comet:turn-off-notification');
    }, false);

    document.addEventListener('online', function() {
        checkToEnableOCN();
    }, false);

    checkToEnableOCN();

});


