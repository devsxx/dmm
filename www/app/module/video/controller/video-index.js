define([
	'video/view/video-index',
	'video/view/video-my'
],function(IndexView, MyView){

	function IndexController ()
	{
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView()
			.render({
				sView: 'all'
			}).inject();
	}
	
	function MyController ()
	{
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new MyView()
			.render({
				sView: 'my'
			}).inject();

	}
	
	utils.router.route('videos', IndexController);
	
	utils.router.route('videos/my', MyController);
});