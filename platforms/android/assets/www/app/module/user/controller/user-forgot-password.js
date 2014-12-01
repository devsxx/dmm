define([
	'utils',
	'user/view/user-forgot-password'
],function(utils, View){
	
	function ForgotPasswordController(){
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		new View().render().inject();
	}
	
	utils.router.route('forgot-password', ForgotPasswordController);
});
