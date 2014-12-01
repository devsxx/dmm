define([
	'event/model/event',
	'event/view/event-invite'
],function(EventModel, EventInviteView){
	
	function EventInviteController(id)
	{
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new EventInviteView({
			model: new EventModel({iEventId: id})
		}).render().inject();
	}
	utils.router.route('events/invite/:id', EventInviteController);
});
