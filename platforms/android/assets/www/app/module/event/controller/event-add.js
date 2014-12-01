define([
	'event/model/event', 
	'event/view/event-add'
], function(EventModel, AddEventView) {

	function AddEventController(module, item) {
		/**
		 * push current page to history
		 */
		// utils.history.push();

		utils.observer.trigger('router:changed');

		new AddEventView({
			model : new EventModel({})
		}).render({
                iItemId: item,
                sModule: module || 'event'
            }).inject();
	}


	utils.router.route('events/add(/:module/:item)', AddEventController);
});
