define([
	'core',
	'music/view/playlist-my'
],function(core, IndexView){
	
	var MyPlaylistController = function(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({}).inject();
	}
	
	utils.router.route('music_playlists/my', MyPlaylistController);
});
