define([
    'subscribe/view/subscription-index'
], function (IndexView) {

    function subscriptionIndex()
    {
//        utils.history.push();

        utils.observer.trigger('router:changed');

        new IndexView().render().inject();
    }

    utils.router.route('subscriptions', subscriptionIndex);
});
