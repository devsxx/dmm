define([
	'core',
	// plugin
	'message/plugin/message-box',
	// controller
	'message/controller/conversation-index',
	'message/controller/conversation-detail',
	'message/controller/message-compose',
	'message/controller/message-reply'
],function(core){
	core.sidebar.configs.set('mail',{
 		icon: 'icon-sidebar-message',
 		label: 'Mails',
 		url: '#messages',
 	});
});
