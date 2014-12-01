define([
    'core',
    'marketplace/controller/listing-add',
    'marketplace/controller/listing-detail',
    'marketplace/controller/listing-edit',
    'marketplace/controller/listing-index',
    'marketplace/controller/listing-invite',
    'marketplace/controller/listing-purchase',
    'marketplace/plugin/activity'
], function(core) {

    core.sidebar.configs.set('marketplace', {
        icon: 'icon-sidebar-marketplace',
        label: 'Marketplace',
        url: '#listings'
    });
});