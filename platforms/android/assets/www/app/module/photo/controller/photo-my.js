define([
	'core',
	'photo/view/photo-my'
], function(core, View){
	
	/*
	*	Controller is called when user selects his/her album tab.
	*/
	function Controller(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new View().render({}).inject();
	}
	
	utils.router.route('photos/my', Controller);
});
