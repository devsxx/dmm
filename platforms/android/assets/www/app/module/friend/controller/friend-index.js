define([
	'core',
	'friend/view/friend-index'
],function(core, IndexView, ListView){
	
	function IndexController(userId)
	{
		var bIsRoot = true;
		
		if (userId) {
			bIsRoot = false;
		}
		
		utils.history.push(bIsRoot);
		
		utils.observer.trigger('router:changed');

		userId = userId || core.viewer.getId();
		
		new IndexView()
			.render({iUserId: userId, bIsRoot: bIsRoot})
			.inject();	
	}
	
	utils.router.route('friends(/:userId)', IndexController);
});
