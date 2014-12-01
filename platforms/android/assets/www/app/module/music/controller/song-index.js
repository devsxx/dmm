define([
	'music/view/song-index',
	// 'music/view/song-my',
],function(IndexView, MyView){
	
	function SongIndexController(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({}).inject();
	}
	
	function MySongController(){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({
            sView: 'my'
        }).inject();
	}
	
	utils.router.route('music_songs/my', MySongController);
	
	utils.router.route('music_songs', SongIndexController);
});
