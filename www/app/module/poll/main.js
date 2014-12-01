define([
	'core',
    'poll/controller/poll-add',
    'poll/controller/poll-detail',
    'poll/controller/poll-edit',
	'poll/controller/poll-index',
	'poll/plugin/activity'
],function(core){
	
	core.sidebar.configs.set('poll',{
 		icon: 'icon-sidebar-poll',
 		label: 'Polls',
 		url: '#polls'
 	});
});
