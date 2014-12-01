define([
    'marketplace/model/listing',
    'marketplace/view/listing-detail'
], function(Model, DetailView) {

    var DetailController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iListingId: id
            })
        }).render().inject();
    }

    var AdvancedDetailController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iListingId: id,
                sModelType: 'advancedmarketplace'
            })
        }).render().inject();
    }

    utils.router.route('listing/:id', DetailController);
    utils.router.route('marketplace/:id', DetailController);
    utils.router.route('advancedmarketplace/:id', AdvancedDetailController);
});