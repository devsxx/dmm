define([
	'video/model/video',
	'video/view/video-detail-info',
],function(VideoModel, InfoView){

	function InfoController(id, action)
	{
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new InfoView({model: new VideoModel({iVideoId: id})}).render().inject();

	}

	function InfoVideoChannelController(id, action)
	{
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new InfoView({model: new VideoModel({
            iVideoId: id,
            sModelType: 'videochannel'
        })}).render().inject();

	}
	
	utils.router.route('video/(:id)(/:comment)', InfoController);
	
	utils.router.route('ynvideo/(:id)(/:comment)', InfoController);
	utils.router.route('videochannel/(:id)(/:comment)', InfoVideoChannelController);
});
