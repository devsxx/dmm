define([
    'core',
    // plugin
    'forum/plugin/activity',
    // load controller
    'forum/controller/forum-detail',
    'forum/controller/forum-index',
    'forum/controller/forum-post-edit',
    'forum/controller/forum-search-results',
    'forum/controller/forum-thread-add',
    'forum/controller/forum-thread-detail',
    'forum/controller/forum-thread-edit',
    'forum/controller/forum-thread-index',
    'forum/controller/forum-thread-reply'
], function(core) {
    core.sidebar.configs.set('forum', {
        label: 'Forums',
        url: '#forums',
        icon: 'icon-sidebar-forum'
    })
});