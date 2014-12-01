define([
    'core/plugin/purchase',
    'text!marketplace/tpl/listing-purchase-update.html',
    'text!marketplace/tpl/listing-purchase.html'
], function(IAP, textUpdate, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            update_holder: '#listing_purchase_holder'
        },
        template: _.template(text),
        templateUpdate: _.template(textUpdate),
        render: function() {

            this.$el.attr({
                id: this.model.getDataId()
            });

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $(this.region.holder);
            this.$scroller = this.$el.find(this.region.scroller);
            this.$update_holder = this.$el.find(this.region.update_holder);

            return this;
        },
        inject: function() {

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {

            var postData = {
                iListingId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('marketplace/detail', postData, settings).done(this.fetchDataDone).fail(this.fetchDataFail);
        },
        fetchDataDone: function(data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.model.set(data);
            this.initIAP();
        },
        fetchDataFail: function() {
            utils.debug.log(arguments);
            utils.history.back();
        },
        initIAP: function() {

            if (!this.model.getStoreKitPurchaseId()) {
                utils.modal.alert(_t('In-App Purchases is not available.'));
                return utils.history.back();
            }

            var self = this;

            var IAPLoad = function(products, invalidIds) {
                self.initIAPDone(products, invalidIds);
            };

            var IAPDone = function(transactionId, productId) {
                self.purchaseDone(transactionId, productId);
            };

            var IAPError = function(errorCode, errorMessage) {
                self.iInvoiceId ? self.purchaseFail(errorCode, errorMessage) : self.initIAPFail(errorMessage);
            };

            IAP.initialize([this.model.getStoreKitPurchaseId()], IAPLoad, IAPDone, IAPError);
        },
        initIAPDone: function(products, invalidIds) {

            this.storeKitPurchase = {};

            for (var i in products) {
                if (products[i].id == this.model.getStoreKitPurchaseId()) {
                    this.storeKitPurchase = $.extend({}, products[i], {
                        price: products[i].price.substr(1)
                    });
                }
            }

            if (!this.storeKitPurchase.id || invalidIds.indexOf(this.model.getStoreKitPurchaseId()) > -1) {
                utils.debug.warn('In-App Purchases Id is invalid.');
                utils.modal.alert(_t('In-App Purchases is not available.'));
                return utils.history.back();
            }

            this.updateView();
        },
        initIAPFail: function(errorMessage) {

            utils.modal.alert(errorMessage);
            return utils.history.back();
        },
        updateView: function() {

            this.$update_holder.html(this.templateUpdate({
                item: this.model
            }));

            this.$commit_btn = this.$el.find('#commit_btn');
        },
        events: {
            'click #commit_btn': 'onCommitClick'
        },
        onCommitClick: function() {

            if (this.$commit_btn.hasClass('processing')) {
                return;
            }

            utils.debug.log('this.storeKitPurchase', JSON.stringify(this.storeKitPurchase));

            if (!IAP.loaded || !this.storeKitPurchase.id) {
                return utils.modal.alert(_t('In-App Purchases is not available.'));
            }

            if (this.model.getCurrencyId() != 'USD') {
                return utils.modal.alert(_t('In-App Purchases does not support this currency. Please purchase in full site.'));
            }

            this.startProcess();

            this.addTransaction();
        },
        addTransaction: function() {

            var postData = {
                iListingId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.post('marketplace/transactionadd', postData, settings).done(this.addTransactionDone).fail(this.addTransactionFail);
        },
        addTransactionDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                this.stopProcess();
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            this.iInvoiceId = data.iInvoiceId;
            this.purchase();
        },
        addTransactionFail: function() {

            utils.debug.warn('FAIL: marketplace/transactionadd', arguments);
            this.stopProcess();
        },
        purchase: function() {

            var quantity = (this.storeKitPurchase.price == 0) ? 1 : Math.ceil(this.model.getPrice() / this.storeKitPurchase.price);

            IAP.buy(this.storeKitPurchase.id, quantity);
        },
        purchaseDone: function(transactionId, productId) {

            this.stopProcess();

            this.updateTransaction('success', transactionId);
            utils.modal.alert('Your payment is completed.');

            window.location.href = '#listings';
        },
        purchaseFail: function(errorCode, errorMessage) {

            this.stopProcess();

            this.updateTransaction('fail');
            utils.modal.alert(errorMessage || _t('Your payment is cancelled.'));
        },
        updateTransaction: function(sStatus, transactionId) {

            var postData = {
                iInvoiceId: this.iInvoiceId,
                sStoreKidTransactionId: transactionId,
                sStatus: sStatus,
                sDevice: constants.device
            };
            var settings = {
                context: this
            };

            utils.api.post('marketplace/transactionupdate', postData, settings).done(this.updateTransactionDone).fail(this.updateTransactionFail).always(function() {
                this.iInvoiceId = null;
            });
        },
        updateTransactionDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.debug.warn('FAIL: marketplace/transactionupdate', data);
            }

            utils.debug.log('SUCCESS: marketplace/transactionupdate', data);
        },
        updateTransactionFail: function() {

            utils.debug.warn('FAIL: marketplace/transactionupdate', arguments);
        },
        startProcess: function() {

            this.$commit_btn.addClass('processing');
            this.$commit_btn.find('span').html(_t('Processing...'));
        },
        stopProcess: function() {

            this.$commit_btn.removeClass('processing');
            this.$commit_btn.find('span').html(_t('Commit to Buy'));
        }
    });
});