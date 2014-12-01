define([
	'activity/view/newsfeed'
],function(IndexView)
	{
		function Controller()
		{
			utils.history.push(true);
			
			utils.observer.trigger('router:changed');

			new IndexView().render({
				
			}).inject();
		}

		utils.router.route('newsfeed', Controller);
});
