define([
	'photo/view/album-index'
],function(IndexView){
	
	/*
	*	Controller is called when user album tab to see all albums.
	*/
	function AlbumIndexController(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({}).inject();
	}

	/*
	*	Controller is called when user selects friend's album tab.
	*/
	function FriendAlbumController(id){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({
			iUserId: id
		}).inject();
		
	}
		
	utils.router.route('albums', AlbumIndexController);

	utils.router.route('albums-of/:id', FriendAlbumController);
});