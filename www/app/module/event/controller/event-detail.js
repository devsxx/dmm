define([
	'event/model/event',
	'event/view/event-detail-info',
	'event/view/event-detail-activity'
], function(Model, InfoView, ActivityView) {

	function ActivityController(type, id) {

		utils.history.push();

		utils.observer.trigger('router:changed');

		new ActivityView({
			model : new Model({
				iEventId : id,
                sModelType: type
			})
		}).render().inject();

	}

	function InfoController(type, id) {
		utils.history.push();

		utils.observer.trigger('router:changed');

		new InfoView({
			model : new Model({
				iEventId : id,
                sModelType: type
			})
		}).render().inject();
	}
    
    utils.router.route('event-detail/:type/:id', InfoController);
    utils.router.route('event-detail/:type/:id/activity', ActivityController);
});
