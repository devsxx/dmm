define([
	'forum/view/forum-index'
], function (View) {
	
	function Controller()
	{
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new View().render().inject();
	}
	
	utils.router.route('forums', Controller);
});