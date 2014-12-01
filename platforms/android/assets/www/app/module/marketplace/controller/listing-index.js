define([
    'marketplace/view/listing-index'
], function(IndexView) {

    var IndexController = function() {

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new IndexView().render({
            sView: 'all'
        }).inject();
    }

    var MyController = function() {

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new IndexView().render({
            sView: 'my',
            iUserId: Backbone.iUserId
        }).inject();
    }

    utils.router.route('listings', IndexController);

    utils.router.route('listings/my', MyController);
});