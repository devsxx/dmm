define([
	// include plugin
	'core/plugin/helper',
	'core/plugin/updater',
	'core/plugin/sidebar',
	'core/plugin/viewer',
	// controller
	'core/controller/index'
],function(){
	
	utils.observer.on('navigate:back',function(){
		window.history.go(-1);
	});
	
	utils.observer.on('navigate:next',function(){
		window.history.go(1);
	});
	
	utils.observer.on('navigate:to',function(ele){
		var href=  ele.data('href');
		window.location.href = href;
	});
	
	return {
		enable: true,
		sidebar: require('core/plugin/sidebar'),
		updater: require('core/plugin/updater'),
		viewer: require('core/plugin/viewer')
	};
});