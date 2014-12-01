define([
    'subscribe/model/package',
    'subscribe/view/subscription-confirm'
], function (Model, SubscribeView) {

    function subscriptionSubscribe(id, purchaseid)
    {
//        utils.history.push();

        utils.observer.trigger('router:changed');

        new SubscribeView({
            model: new Model({
                iPackageId: id,
                iSignupPurchaseId: purchaseid
            })
        }).render().inject();
    }

    utils.router.route('subscribe/:id', subscriptionSubscribe);
    utils.router.route('subscribe/:id(/:purchaseid)', subscriptionSubscribe);
});
