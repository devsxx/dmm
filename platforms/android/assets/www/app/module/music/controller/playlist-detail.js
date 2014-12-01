define([
	'music/view/playlist-detail',
	'music/model/playlist'
], function(DetailView, PlaylistModel) {

	function DetailController(id, action) {

		utils.history.push();

		utils.observer.trigger('router:changed');

		new DetailView({
			model : new PlaylistModel({
				iAlbumId : id
			})
		}).render().inject();
	}
	
	utils.router.route('music_playlist/:id(/:action)', DetailController);
	utils.router.route('music_album/:id(/:action)', DetailController);
});
