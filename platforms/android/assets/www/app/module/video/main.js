define([
	'core',
	// plugin
	'video/plugin/activity',
	// controller
	'video/controller/video-index',
	'video/controller/video-detail',
	'video/controller/video-edit'
],function(core){
	core.sidebar.configs.set('video',{
 		icon: 'icon-sidebar-video',
 		label: 'Videos',
 		url: '#videos',
 	});
});
