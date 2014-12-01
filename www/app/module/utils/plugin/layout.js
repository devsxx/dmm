define([
	'utils/plugin/observer',
],function(observer){
	var container = $(document.body)
	, lastBeeber = ''
	, sidebarIsShown = false
	, bottomIsShown = false;
	
	observer.on('sidebar:open', function() {
		container.addClass('sidebar-open');
		sidebarIsShown = true;
	}).on('sidebar:close', function() {
		container.removeClass('sidebar-open');
		sidebarIsShown = false;
	}).on('sidebar:pre_show', function() {
		if (lastBeeber) {
			lastBeeber.close();
			lastBeeber = false;
		}
	}).on('beeber:after_close', function() {
		lastBeeber = false;
	}).on('beeber:before_open', function(beeber) {
		if (lastBeeber) {
			lastBeeber.close();
		}
		lastBeeber = beeber;
	}).on('router:changed', function() {
		if (lastBeeber) {
			lastBeeber.close();
			lastBeeber = false;
		}
		if(sidebarIsShown){
			$(document.body).removeClass('sidebar-open');
			sidebarIsShown = false;
		}
		if(bottomIsShown){
			$(document.body).removeClass('bottom-open');
			bottomIsShown = false;
		}
	})
	.on('bottom:open', function() {
		bottomIsShown = true;
		$(document.body).addClass('bottom-open');
	}).on('bottom:close', function() {
		bottomIsShown =  false;
		$(document.body).removeClass('bottom-open');
	}); 
	
	return {
		bottomIsShown: function(){return bottomIsShown;}
	}
});
