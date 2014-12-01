define([
	'music/view/playlist-index',
	'music/view/playlist-my',
],function(IndexView, MyView){
	
	function PlaylistIndexController(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({}).inject();
	}
	
	function MyPlaylistController(){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new MyView().render({}).inject();
	}
	
	utils.router.route('music_playlists/my', MyPlaylistController);
	
	utils.router.route('music_playlists', PlaylistIndexController);
});
