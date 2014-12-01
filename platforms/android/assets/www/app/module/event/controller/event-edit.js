define([
	'event/model/event',
	'event/view/event-edit'
],function(EventModel, EditEventView){
	
	function EditEventController(id)
	{
		// utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new EditEventView({
			model: new EventModel({iEventId: id})
		}).render().inject();
	}
	utils.router.route('events/edit/:id', EditEventController);
});
