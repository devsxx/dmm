define([
    'text!marketplace/tpl/country-childs.html',
    'text!marketplace/tpl/listing-add-form.html',
    'text!marketplace/tpl/listing-add.html'
], function(textCountryChilds, textForm, text) {

    return Backbone.View.extend({
        className: 'listing-add',
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#listing_add_form_holder'
        },
        template: _.template(text),
        templateCountryChilds: _.template(textCountryChilds),
        templateForm: _.template(textForm),
        render: function(context) {

            this.context = $.extend({
                iItemId: null,
                sModule: null
            }, context);

            this.$el.attr('id', 'listing_add');

            this.$el.html(this.template(this.context));

            this.$form_holder = this.$el.find(this.region.formHolder);
            this.$save_btn = this.$el.find('#save_btn');

            this.aCategoryId = [];

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {
            utils.api.get('marketplace/formadd', {}, {
                context: this
            }).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.formData = data;
            this.updateView();
        },
        updateView: function(data) {

            this.$form_holder.html(this.templateForm({
                data: this.formData
            }));

            this.$form_title = this.$el.find('#listing_form_title');
            this.$form_mini_description = this.$el.find('#listing_form_mini_description');
            this.$form_description = this.$el.find('#listing_form_description');
            this.$form_currency = this.$el.find('#listing_form_currency');
            this.$form_price = this.$el.find('#listing_form_price');
            this.$form_sell = this.$el.find('#listing_form_sell');
            this.$form_country = this.$el.find('#listing_form_country');
            this.$form_country_childs_holder = this.$el.find('#listing_form_country_childs_holder');
            this.$form_city = this.$el.find('#listing_form_city');
            this.$form_zipcode = this.$el.find('#listing_form_zipcode');
            this.$form_privacy = this.$el.find('#listing_form_privacy');
            this.$form_privacy_comment = this.$el.find('#listing_form_privacy_comment');

            // bind input edit, paste events
            var self = this;
            this.$el.find('input').bind('input propertychange', function() {
                self.toggleSaveBtn();
            });
			this.$scroller.trigger('refresh');
        },
        fetchDataFail: function() {
            utils.debug.warn('FAIL: marketplace/formadd', arguments);
            utils.history.back();
        },
        events: {
            'change #listing_form_country': 'onChangeCountry',
            'change .listing-form-category': 'onChangeCategory',
            'click #save_btn': 'saveListing'
        },
        onChangeCountry: function(evt) {

            this.toggleSaveBtn();

            this.$form_country_childs_holder.empty();

            if (this.$form_country.val()) {
                this.fetchChilds();
            }
        },
        fetchChilds: function() {

            var postData = {
                sCountryIso: this.$form_country.val()
            };
            var settings = {
                context: this
            };

            this.ajaxChilds && this.ajaxChilds.abort();

            this.ajaxChilds = utils.api.get('core/getchilds', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load country childs'));
                }

                this.updateChilds(data);
            }).fail(function() {
                utils.debug.warn('FAIL: core/getchilds', arguments);
            });
        },
        updateChilds: function(data) {

            if (data.length > 0) {
                this.$form_country_childs_holder.html(this.templateCountryChilds({
                    data: data,
                    selected: 0
                }));
            }
        },
        onChangeCategory: function(evt) {

            var $target = $(evt.currentTarget);

            var $subs_holder = $target.parent().children('.listing-form-category-subs-holder');

            $subs_holder.empty();

            this.updateCategories();

            this.toggleSaveBtn();

            if ($target.val()) {
                this.appendSubCategories($target);
            }
        },
        updateCategories: function() {

            this.aCategoryId = [];

            var $form_category = this.$el.find('.listing-form-category');

            _.each($form_category, function(item) {
                if ($(item).val()) {
                    this.aCategoryId.push($(item).val());
                }
            }, this);
        },
        appendSubCategories: function($target, aSelected) {

            var subCategoriesHtml = utils.helper.getSubCategoriesHtml(this.formData.category_options, $target.val(), aSelected);

            var $subs_holder = $target.parent().children('.listing-form-category-subs-holder');

            $subs_holder.html(subCategoriesHtml);
        },
        saveListing: function(evt) {

            if (this.$save_btn.hasClass('processing')) {
                return;
            }

            if (!this.validateData(true)) {
                return;
            }

            var $form_country_childs = this.$el.find('#listing_form_country_childs');

            var postData = {
                aCategoryId: this.aCategoryId,
                sTitle: this.$form_title.val(),
                sCountryIso: this.$form_country.val(),
                sPrice: this.$form_price.val(),
                sMiniDescription: this.$form_mini_description.val(),
                sDescription: this.$form_description.val(),
                sCurrencyId: this.$form_currency.val(),
                iIsSell: this.$form_sell.val(),
                iAutoSell: 0,
                iCountryChildId: $form_country_childs.length > 0 ? $form_country_childs.val() : 0,
                sCity: this.$form_city.val(),
                sPostalCode: this.$form_zipcode.val(),
                iPrivacy: this.$form_privacy.val(),
                iPrivacyComment: this.$form_privacy_comment.val(),
                sEmails: '',
                sPersonalMessage: '',
            };

            var settings = {
                context: this
            };

            this.$save_btn.addClass('processing');

            utils.api.post('marketplace/create', postData, settings).done(this.saveDone).always(function() {
                this.$save_btn.removeClass('processing');
            });
        },
        saveDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            utils.modal.toast(data.message || _t('Listing successfully added.'));

            window.location.href = '#listing/' + data.iListingId + '/edit/photo';
        },
        validateData: function(bAlert) {

            if (this.aCategoryId.length == 0) {
                bAlert && utils.modal.alert(_t('Provide a category this listing will belong to.'));
                return false;
            }

            if (!this.$form_title.val().trim()) {
                bAlert && utils.modal.alert(_t('Provide a name for this listing.'));
                return false;
            }

            if (!this.$form_price.val().trim()) {
                bAlert && utils.modal.alert(_t('Provide a valid price.'));
                return false;
            }

            if (!this.$form_country.val()) {
                bAlert && utils.modal.alert(_t('Provide a location for this listing.'));
                return false;
            }

            return true;
        },
        toggleSaveBtn: function(evt) {

            var bDisable = !this.validateData();

            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});