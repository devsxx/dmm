define([
    'chat/view/chat-index'
], function() {
    var ChatIndexView = require('chat/view/chat-index')
      , currentIndexView 

    var handleChatIndex = function() {
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		currentIndexView = new ChatIndexView().render({
		}).inject();
    }

	utils.router.route('chat', handleChatIndex); 

});
