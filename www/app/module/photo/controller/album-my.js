define([
	'core',
	'photo/view/album-my'
], function(core, MyAlbumView){
	
	/*
	*	Controller is called when user selects his/her album tab.
	*/
	function MyAlbumController(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new MyAlbumView().render({}).inject();
	}
	
	utils.router.route('albums/my', MyAlbumController);
});
