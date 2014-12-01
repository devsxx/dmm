define([
    'music/view/more-action'
],function(MoreActionView){
	
	// init sidebar plugin
	/* var sidebarView = new SidebarView().render().inject(); */
	
	utils.observer.on('music:open-more',function(){
        new MoreActionView().render().inject();
	});
	
	
	// return sidebarView;
});

