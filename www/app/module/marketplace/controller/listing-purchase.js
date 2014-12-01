define([
    'marketplace/model/listing',
    'marketplace/view/listing-purchase'
], function(Model, PurchaseView) {

    var PurchaseController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new PurchaseView({
            model: new Model({
                iListingId: id
            })
        }).render().inject();
    }

    utils.router.route('listing/:id/purchase', PurchaseController);
});