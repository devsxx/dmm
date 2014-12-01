define([
	'core',
	'message/view/message-compose'
],function(core, View){
	
	function Controller(id){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new View().render({
			iUserId: id
		}).inject();
	}
	
	utils.router.route('messages/compose(/:id)', Controller);
	
});
