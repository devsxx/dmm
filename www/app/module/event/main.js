define([
	'core',
	// plugin
	'event/plugin/activity',
	// load controller
	'event/controller/event-add',
    'event/controller/event-index',
    'event/controller/event-invite',
	'event/controller/event-edit',
	'event/controller/event-detail'
], function(core){
 	core.sidebar.configs.set('event',{
 		icon: 'icon-sidebar-event',
 		label: 'Events',
 		url: '#events'
 	});
});
