define([
	'core',
	'message/view/message-reply'
],function(core, View){
	
	function Controller(iConversationId){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new View().render(iConversationId).inject();
	}
	
	utils.router.route('message-reply/:id', Controller)
});
