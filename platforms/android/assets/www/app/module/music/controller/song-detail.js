define([
	'music/view/song-detail',
	'music/model/song'
], function(DetailView, PlaylistModel) {

	function DetailController(id, action) {

		utils.history.push();

		utils.observer.trigger('router:changed');

		new DetailView({
			model : new PlaylistModel({
				iSongId : id
			})
		}).render().inject();
	}
	
	utils.router.route('music_song/:id(/:action)', DetailController);
});
