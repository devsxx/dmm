define([], function() {

    var Model = Backbone.Model.extend({
        idAttribute: 'iPackageId',
        defaults: {
            sModelType: 'subscribe'
        }
    });

    Model.prototype.getPackageImageSrc = function() {

        return this.get('sSubscriptionPackageImage') || '';
    };

    Model.prototype.getDefaultCost = function() {

        return this.get('sDefaultCost') || '';
    };

    Model.prototype.getCurrencySymbol = function() {

        return this.get('sCurrencySymbol') || '';
    };

    Model.prototype.getDefaultRecurringCost = function() {

        return this.get('sDefaultRecurringCost') || '';
    };

    Model.prototype.getRecurringPeriod = function() {

        return this.get('sRecurringPeriod').toLowerCase() || '';
    };

    Model.prototype.getStoreKitPurchaseId = function() {
        return this.get('aStoreKitPurchaseId')[constants.device] || '';
    }

    Model.prototype.getCurrencyId = function() {
        return this.get('sDefaultCurrencyId') || '';
    }

    Model.prototype.getSignupPurchaseId = function() {
        return this.get('iSignupPurchaseId') || 0;
    }

    Model.prototype.getPlayStoreProductId = function() {
        return this.get('sPlayStoreProductId') || '';
    }

    return Model;
});