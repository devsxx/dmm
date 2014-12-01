define([
    'comet/view/chat-detail'
], function() {
    var ChatDetailView = require('comet/view/chat-detail')
    var handleChatDetail = function(type, id) {
		utils.history.push();
		utils.observer.trigger('router:changed');
		
		new ChatDetailView().render({
            iItemId: id,
            sItemType: type
		}).inject();
    }

	utils.router.route('cometchat-detail/:type/:id', handleChatDetail); 

});

