define([
    'marketplace/model/listing',
    'marketplace/view/listing-edit'
], function(Model, EditView) {

    var EditController = function(id, view) {

        utils.observer.trigger('router:changed');

        new EditView({
            model: new Model({
                iListingId: id
            })
        }).render({
            sView: view || 'info'
        }).inject();
    }

    utils.router.route('listing/:id/edit(/:view)', EditController);
});