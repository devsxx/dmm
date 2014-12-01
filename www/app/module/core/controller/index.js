define([
	'core/view/lost-connection'
],function(LostConnectionView) {
	

	function HomeController() {
	
		var token = constants.token;

		if (token) {
			window.location.href = '#newsfeed';
		} else {

			window.location.href =  '#login';
		}
	}
	
	function LostConnectionController()
	{
        utils.observer.trigger('router:changed');

		new LostConnectionView().render().inject();
	}
	
	utils.router.route('lost-connection',LostConnectionController);

	utils.router.route('home', HomeController);

    setTimeout(function() {
    	
    	if(!navigator.connection){  // in brower
    		return false;
    	}
    	
        if(navigator.connection.type == Connection.NONE) {
            if(!Backbone.History.started) {
                Backbone.history.start();
            }
            window.location.href = '#lost-connection';
        }

        document.addEventListener('offline', function() {
            window.location.href = '#lost-connection';
        }, false);

        document.addEventListener('online', function() {
            HomeController();
        }, false);
    }, 2000); //start listening 2000s after starting application
});
