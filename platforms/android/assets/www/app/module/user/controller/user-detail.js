define([
	'user/model/user',
	'user/view/user-detail-info',
	'user/view/user-detail-photo',
	'user/view/user-detail-album'
],function(UserModel, InfoView, PhotoView, AlbumView){
	
	function InfoController(id)
	{
		var bIsRoot = (utils.history._data.length == 0 && id == Backbone.iUserId);
		utils.history.push(bIsRoot);
		
		utils.observer.trigger('router:changed');
		
		new InfoView({
			model: new UserModel({iUserId: id})
		}).render({
			bIsRoot: bIsRoot
		}).inject();
	}
	
	function PhotoController(id){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new PhotoView({
			model: new UserModel({iUserId: id})
		})
		.render().inject();
	}
	
	function AlbumController(id){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new AlbumView({
			model: new UserModel({iUserId: id})
		})
		.render().inject();
	}
	
	utils.router.route('user-photo/:id', PhotoController);
	
	utils.router.route('user-album/:id', AlbumController);
	
	utils.router.route('user/:id(/:action)', InfoController);
	
});
