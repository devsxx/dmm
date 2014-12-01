define([
	'core',
	// plugin
	'photo/plugin/activity',
	// plugin
	'photo/controller/album-index',
	'photo/controller/photo-index',
	'photo/controller/album-my',
    'photo/controller/photo-my',
	'photo/controller/album-add',
	'photo/controller/album-detail'
],function(core){

	core.sidebar.configs.set('photo',{
 		icon: 'icon-sidebar-photo',
 		label: 'Albums',
 		url: '#albums',
 	});
 	
});
