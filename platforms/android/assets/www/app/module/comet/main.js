define([
	'comet/plugin/notification',

	// 'chat/controller/chat-detail',
	'comet/controller/chat-index'
], function() {

	utils.setting.set('cometchat_enabled', true);

	return {
		enable : true
	};
});
