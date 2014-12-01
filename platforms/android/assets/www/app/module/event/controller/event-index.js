define([
	'event/view/event-index'
],function(IndexView){
	
	function UpcomingEventsController(filter)
	{
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');

		new IndexView()
			.render({
				sView: 'upcomming' 
			})
			.inject();
	}
	
	function PastEventsController(){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new IndexView()
			.render({
				sView: 'past'
			})
			.inject();
	}
	
	function MyEventsController(){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new IndexView()
			.render({
				sView: 'my'
			})
			.inject();
	}
	
	
	utils.router.route('events', UpcomingEventsController);
	
	utils.router.route('events/my', MyEventsController);
	
	utils.router.route('events/past', PastEventsController);
	
});
