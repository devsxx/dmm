define([
    'marketplace/model/listing',
    'marketplace/view/listing-invite'
], function(ListingModel, ListingInviteView) {

    function ListingInviteController(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new ListingInviteView({
            model: new ListingModel({
                iListingId: id
            })
        }).render().inject();
    }

    utils.router.route('listing/:id/invite', ListingInviteController);
});