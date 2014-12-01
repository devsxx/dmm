define([
	'user/model/user',
	'user/view/user-about'
],function(Model, AboutView){
	
	function AboutController(id)
	{
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new AboutView({
			model: new Model({iUserId: id})
		}).render().inject();
	}

	utils.router.route('user-about/:id', AboutController);
	
});
