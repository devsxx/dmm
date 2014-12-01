define([
	'core',
	// plugin
	'friend/plugin/request',
	'friend/plugin/friend-action',
	'friend/plugin/activity',
	// controller
	'friend/controller/friend-index'
],function(core){
	
	core.sidebar.configs.set('friend',{
 		icon: 'icon-sidebar-friend',
 		label: 'Friends',
 		url: '#friends',
 	});
});
