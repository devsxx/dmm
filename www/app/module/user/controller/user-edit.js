define([
	'user/model/user',
	'user/view/edit-profile-info'
],function(UserModel, EditView){
	
	function editController(id)
	{
		// utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new EditView({
			model: new UserModel({iUserId: id})
		}).render().inject();
	}

	utils.router.route('user-edit/:id', editController);
	
});

