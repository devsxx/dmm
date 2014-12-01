define([
	'user/plugin/signup-data',
	'user/view/user-signup-step-01',
	'user/view/user-signup-step-02',
	'user/view/user-signup-step-03',
	'user/view/user-signup-step-04',
	'user/view/user-signup-step-05'
],function() {

	var signupData = require('user/plugin/signup-data')
	  , Step01View = require('user/view/user-signup-step-01')
	  , Step02View = require('user/view/user-signup-step-02')
	  , Step03View  = require('user/view/user-signup-step-03')
	  , Step04View  = require('user/view/user-signup-step-04')
	  , Step05View  = require('user/view/user-signup-step-05');
	
	function Step01Controller() 	
	{
		utils.history.push(true);
		
		
		utils.observer.trigger('router:changed');
		
		new Step01View()
			.render({
				
			})
			.inject();
	}
	
	function Step02Controller(){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new Step02View()
			.render({
				
			})
			.inject();
	}
	
	function Step03Controller(){
		
		// utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new Step03View()
			.render({
				
			})
			.inject();
	}

	function Step04Controller(){
		
		// utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new Step04View()
			.render({
				
			})
			.inject();
	}

	// function Step05Controller(){
		
	// 	// utils.history.push();
		
	// 	utils.observer.trigger('router:changed');
		
	// 	new Step05View()
	// 		.render({
				
	// 		})
	// 		.inject();
	// }


	utils.router.route('signup', Step01Controller);
	
	utils.router.route('signup/step01', Step01Controller);
	
	utils.router.route('signup/step02', Step02Controller);
	
	utils.router.route('signup/step03', Step03Controller);

	utils.router.route('signup/step04', Step04Controller);

	//utils.router.route('signup/step05', Step05Controller);
});
