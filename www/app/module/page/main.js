define([
    'core',
    'page/controller/page-index',
    'page/controller/page-add',
    'page/controller/page-edit',
    'page/controller/page-detail',
    'page/controller/page-invite',
    'page/plugin/activity'
], function (core) {

    core.sidebar.configs.set('page',{
        icon: 'icon-sidebar-page',
        label: 'Pages',
        url: '#pages'
    });
});
