define([
	'core/view/sidebar'
],function(SidebarView){
	
	// init sidebar plugin
	var sidebarView = new SidebarView().render().inject();
	
	utils.observer.on('app:run',function(){
		sidebarView.fetchData();
	});
	
	
	return sidebarView;
});
