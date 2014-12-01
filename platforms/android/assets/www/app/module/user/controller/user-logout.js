define([
	'user/view/user-login'
], function(View){
	
	function Controller(){
		
		utils.history.clear();
		
		utils.history.push();
		
		utils.observer.trigger('router:changed');
		
		utils.observer.trigger('user:logout');
		
		
		localStorage.setItem('user.viewer','');
		localStorage.setItem('token','');
		constants.token = '';
		
		utils.api.setup({
			token: null
		});
		
		window.location.href = '#login';
	}
	
	utils.router.route('logout', Controller);
});
