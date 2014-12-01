define([
    'chat/plugin/notification',

    // 'chat/controller/chat-detail',
    'chat/controller/chat-index'
], function() {

    utils.setting.set('chat_enabled', 1);

    return {
        enable: true
    };
});