define([
    'core',
    'chat/collection/chat'
], function() {
    var core = require('core'),
        $popupChat = $('#popup-chat'),
        ChatCollection = require('chat/collection/chat')

    localStorage.setItem('chat_notification', '');

    utils.observer.on('chat:turn-on-notification', function($ele, evt) {
        localStorage.setItem('chat_notification', '1');
        $('#popup-chat').show();
    });

    utils.observer.on('chat:turn-off-notification', function($ele, evt) {
        localStorage.setItem('chat_notification', '');
        $('#popup-chat').hide();
    });

    utils.observer.on('chat:update-notification', function(collection) {
        var total = 0;
        _.each(collection.models, function(item) {
            if (item.getNumberUnreadMesssages() > 0) {
                total += 1;
            }
        }, this)
        $('#popup-chat').find('span').html(total);
    });

    var checkToEnableOCN = function() {
        var nof = !!localStorage.getItem('chat_notification');
        if (nof) {
            $('#popup-chat').show();
        } else {
            $('#popup-chat').hide();
        }
    }


    $popupChat.on('click', function() {
        // utils.observer.trigger('chat:show-latest-conversation');
        window.location.href = '#chat';
        setTimeout(function() {
            utils.observer.trigger('chat:show-latest-conversation');
        }, 200);
    });

    utils.observer.on('user:logout', function() {
        utils.observer.trigger('chat:turn-off-notification');
        // window.clearInterval(interval);
    })

    utils.observer.on('user:login', function() {
        checkToEnableOCN();
    })

    checkToEnableOCN();

});