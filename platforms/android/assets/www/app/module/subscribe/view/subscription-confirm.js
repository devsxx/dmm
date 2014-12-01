define([
    'core/plugin/purchase',
    'text!subscribe/tpl/subscription-confirm.html',
    'text!subscribe/tpl/subscription-confirm-update.html'
], function(IAP, text, textUpdate) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content'
        },
        className: 'subscription-subscribe-page',
        template: _.template(text),
        templateUpdate: _.template(textUpdate),
        moduleId: 'subscribe/view/subscription-subscribe',
        render: function() {

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $('#main');

            this.$el.attr({
                id: this.model.getDataId()
            });

            this.$detailHolder = this.$el.find('#subscription_confirm_detail');

            return this;

        },
        inject: function() {

            this.$holder.html(this.$el);

            this.fetchData();

            // parallel these task
            return this;
        },
        fetchData: function() {
            // get data

            var sendData = {
                    iPackageId: this.model.getId()
                },
                settings = {
                    context: this
                };

            utils.api.get('subscribe/detail', sendData, settings)
                .done(this.fetchDataComplete)
                .fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {

                utils.modal.alert(data.error_message);

                utils.history.back();
            } else {

                this.model.set(data);

                this.updateView();
            }
        },
        fetchDataFail: function(error, msg) {

            msg = msg || _t('Could not fetch data');

            utils.modal.alert(msg);
        },
        updateView: function() {

            this.$detailHolder.html(this.templateUpdate({
                item: this.model
            }));

            this.$commit_btn = this.$el.find('#buy_btn');

            var $back_btn = $('#back_btn');

            if (this.model.getSignupPurchaseId()) {
                $back_btn.html(_t('Log out'));
            } else {
                $back_btn.html(_t('Cancel'));
            }
        },
        events: {
            'click #buy_btn': 'onBuyClick',
            'click #back_btn': 'onBackClick'
        },
        onBuyClick: function() {

            if (this.$commit_btn.hasClass('processing')) {
                return;
            }

            this.startProcess();

            (constants.platform == 'ios') ? this.initIAP() : this.initIAB();
        },
        initIAP: function() {

            if (!this.model.getStoreKitPurchaseId()) {
                this.stopProcess();
                return utils.modal.alert(_t('In-App Purchases is not available.'));
            }

            if (this.model.getCurrencyId() != 'USD') {
                this.stopProcess();
                return utils.modal.alert(_t('In-App Purchases does not support this currency. Please purchase in web site.'));
            }

            var self = this;

            var IAPLoad = function(products, invalidIds) {
                self.initIAPDone(products, invalidIds);
            };

            var IAPDone = function(transactionId, productId) {
                self.purchaseWithIAPDone(transactionId, productId);
            };

            var IAPError = function(errorCode, errorMessage) {
                self.iPurchaseId ? self.purchaseWithIAPFail(errorCode, errorMessage) : self.initIAPFail(errorMessage);
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
                this.stopProcess();
                return;
            }

            this.initPurchase();
        },
        initIAPFail: function(errorMessage) {

            this.stopProcess();

            return utils.modal.alert(errorMessage);
        },
        initIAB: function() {

            if (!window.inappbilling || !this.model.getPlayStoreProductId()) {
                this.stopProcess();
                return utils.modal.alert(_t('In-App Billing is not available.'));
            }

            var self = this;

            var successCb = function() {
                utils.debug.log('SUCCESS: initIAB', arguments);
                self.initPurchase();
            };

            var errorCb = function() {
                utils.debug.warn('ERROR: initIAB', arguments);
                self.stopProcess();
                return utils.modal.alert(_t('In-App Billing is not available.'));
            };

            var options = {
                showLog: true
            };

            var skus = this.model.getPlayStoreProductId();

            inappbilling.init(successCb, errorCb, options); //, skus);
        },
        initPurchase: function() {

            // skip add transaction if user is just sign up because transaction is done automatically on server side
            if (this.model.getSignupPurchaseId()) {
                this.iPurchaseId = this.model.getSignupPurchaseId();
                (constants.platform == 'ios') ? this.purchaseWithIAP() : this.purchaseWithIAB();
            } else {
                this.addTransaction();
            }
        },
        addTransaction: function() {

            var postData = {
                iPackageId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.post('subscribe/transactionadd', postData, settings).done(this.addTransactionDone).fail(this.addTransactionFail);
        },
        addTransactionDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                this.stopProcess();
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            this.iPurchaseId = data.iPurchaseId;
            (constants.platform == 'ios') ? this.purchaseWithIAP() : this.purchaseWithIAB();
        },
        addTransactionFail: function() {

            utils.debug.warn('FAIL: subscribe/transactionadd', arguments);
            this.stopProcess();
        },
        purchaseWithIAP: function() {

            var quantity = (this.storeKitPurchase.price == 0) ? 1 : Math.ceil(this.model.getDefaultCost() / this.storeKitPurchase.price);

            IAP.buy(this.storeKitPurchase.id, quantity);
        },
        purchaseWithIAPDone: function(transactionId, productId) {

            this.stopProcess();

            this.updateTransaction('success', transactionId);

            utils.modal.alert('Your payment is completed.');

            if (this.model.getSignupPurchaseId()) { // login or back
                utils.modal.toast('Signup sucessfully');
                window.location.href = constants.home;
            } else {
                utils.history.back();
            }
        },
        purchaseWithIAPFail: function(errorCode, errorMessage) {

            this.stopProcess();

            this.updateTransaction('fail');

            utils.modal.alert(errorMessage || _t('Your payment is cancelled.'));
        },
        purchaseWithIAB: function() {

            var self = this;

            var successCb = function(data) {
                utils.debug.log('SUCCESS: purchaseWithIAB', arguments);
                self.purchaseWithIABSuccess(data);
            };

            var errorCb = function(error) {
                utils.debug.warn('ERROR: purchaseWithIAB', arguments);
                self.purchaseWithIABError(error);
            };

            inappbilling.buy(successCb, errorCb, this.model.getPlayStoreProductId());
        },
        purchaseWithIABSuccess: function(data) {

            this.stopProcess();

            this.updateTransaction('success', null, data.orderId);

            utils.modal.alert('Your payment is completed.');

            if (this.model.getSignupPurchaseId()) { // login or back
                utils.modal.toast('Signup sucessfully');
                window.location.href = constants.home;
            } else {
                utils.history.back();
            }
        },
        purchaseWithIABError: function(error) {

            this.stopProcess();

            this.updateTransaction('fail');

            utils.modal.toast(error.match(/\d+:([^\)]+)/)[1] || _t('Your payment is not completed.'));
        },
        updateTransaction: function(sStatus, transactionId, orderId) {

            var postData = {
                iPurchaseId: this.iPurchaseId,
                sStoreKidTransactionId: transactionId,
                sPlayStoreOrderId: orderId,
                sStatus: sStatus,
                sDevice: constants.device
            };
            var settings = {
                context: this
            };

            utils.api.post('subscribe/transactionupdate', postData, settings).done(this.updateTransactionDone).fail(this.updateTransactionFail).always(function() {
                this.iPurchaseId = null;
            });
        },
        updateTransactionDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            utils.debug.log('SUCCESS: subscribe/transactionupdate', data);
        },
        updateTransactionFail: function() {

            utils.debug.warn('FAIL: subscribe/transactionupdate', arguments);

            this.stopProcess();
        },
        startProcess: function() {

            this.$commit_btn.addClass('processing');
            this.$commit_btn.html(_t('Processing...'));
        },
        stopProcess: function() {

            this.$commit_btn.removeClass('processing');
            this.$commit_btn.html(_t('Buy'));
        },
        onBackClick: function() {
            if (this.model.getSignupPurchaseId()) {
                window.location.href = '#logout';
            } else {
                utils.history.back();
            }
        }
    });

});