define([
	'blog/view/blog-index'
],function(IndexView){
	
	var IndexController = function (){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({
			sView: 'all'
		}).inject();
	}
	
	var MyController = function(){
		
		utils.history.push(true);
		
		utils.observer.trigger('router:changed');
		
		new IndexView().render({
			sView: 'my',
            iUserId: Backbone.iUserId
		}).inject();
	}
	
	utils.router.route('blogs', IndexController);
	
	utils.router.route('blogs/my', MyController);
});
