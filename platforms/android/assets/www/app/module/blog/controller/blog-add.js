define([
    'blog/view/blog-add'
], function(AddView) {

    var AddController = function(module, item) {

        utils.observer.trigger('router:changed');

        new AddView().render({
            iItemId: item,
            sModule: module || 'blog'
        }).inject();
    }

    utils.router.route('blogs/add(/:module/:item)', AddController);
});