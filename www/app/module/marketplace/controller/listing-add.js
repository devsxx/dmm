define([
    'marketplace/view/listing-add'
], function(AddView) {

    var AddController = function(module, item) {

        utils.observer.trigger('router:changed');

        new AddView().render({
            iItemId: item,
            sModule: module || 'listing'
        }).inject();
    }

    utils.router.route('listings/add(/:module/:item)', AddController);
});