define([
    'subscribe/view/subscription-upgrade'
], function (IndexView) {

    function subscriptionUpgrade()
    {
        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new IndexView().render().inject();
    }

    utils.router.route('subscriptions/upgrade', subscriptionUpgrade);
});
