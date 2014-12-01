define([], function() {
    'use strict';

    var IAP = {
        list: [],
        products: {}
    };

    var localStorage = window.localStorage || {};

    IAP.initialize = function(list, loadCallback, purchaseCallback, errorCallback) {

        utils.debug.log('IAP.initialize', JSON.stringify(arguments));

        IAP.list = _.union(IAP.list, list);
        IAP.loadCallback = loadCallback;
        IAP.purchaseCallback = purchaseCallback;
        IAP.errorCallback = errorCallback;

        // Check availability of the storekit plugin
        if (!window.storekit) {
            var errorMessage = _t('In-App Purchases is not available.');
            IAP.errorCallback && IAP.errorCallback(1, errorMessage);
            return utils.debug.warn('FAIL: IAP.initialize', errorMessage);
        }

        // Initialize
        storekit.init({
            ready: IAP.onReady,
            purchase: IAP.onPurchase,
            restore: IAP.onRestore,
            error: IAP.onError
        });
    };

    IAP.onReady = function() {
        // Once setup is done, load all product data.
        storekit.load(IAP.list, function(products, invalidIds) {

            utils.debug.log('DONE: storekit.load', JSON.stringify(arguments));

            IAP.loaded = true;

            IAP.loadCallback && IAP.loadCallback(products, invalidIds);
        });
    };

    IAP.onPurchase = function(transactionId, productId /*, receipt*/ ) {

        utils.debug.log('IAP.onPurchase', JSON.stringify(arguments));

        var n = (localStorage['storekit.' + productId] | 0) + 1;
        localStorage['storekit.' + productId] = n;

        IAP.purchaseCallback && IAP.purchaseCallback(transactionId, productId);
    };

    IAP.onError = function(errorCode, errorMessage) {

        utils.debug.warn('IAP.onError', JSON.stringify(arguments));

        IAP.errorCallback && IAP.errorCallback(errorCode, errorMessage);
    };

    IAP.onRestore = function(transactionId, productId /*, transactionReceipt*/ ) {
        var n = (localStorage['storekit.' + productId] | 0) + 1;
        localStorage['storekit.' + productId] = n;
    };

    IAP.buy = function(productId, quantity) {

        utils.debug.log('IAP.buy', JSON.stringify(arguments));

        storekit.purchase(productId, quantity);
    };

    IAP.restore = function() {
        storekit.restore();
    };

    return IAP;
});