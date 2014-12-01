define([
    'core',
    'subscribe/controller/subscription-index',
    'subscribe/controller/subscription-upgrade',
    'subscribe/controller/subscription-confirm'
], function(core) {

    core.sidebar.configs.set('subscribe', {
        icon: 'icon-sidebar-subscription',
        label: 'Memberships',
        url: '#subscriptions/upgrade'
    });
});