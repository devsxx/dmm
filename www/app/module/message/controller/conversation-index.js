define([
	'core',
	'message/view/conversation-index'
],function(core, IndexView){
	
	var InboxController = function (){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({
			filter: 'inbox'
		}).inject();
	}
	
	var SentController = function(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({
			filter: 'sent'
		}).inject();
	}
	
	utils.router.route('messages', InboxController);
	
	utils.router.route('messages/sent', SentController);
});
