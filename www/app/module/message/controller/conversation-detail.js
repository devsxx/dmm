define([
	'message/model/conversation',
	'message/view/conversation-detail'
],function(Model, View){
	
	function Controller(iConversationId){
		
		utils.history.push();	
		
		utils.observer.trigger('router:changed');
		
		new View({
            model: new Model({
                iConversationId: iConversationId
            })
        }).render().inject();
	}
	
	utils.router.route('message/:id', Controller);
});
