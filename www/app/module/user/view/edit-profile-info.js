define([
    'text!user/tpl/edit-profile-info.html',
    'text!user/tpl/edit-profile-info-content.html',
    'text!user/tpl/country-childs.html'
], function(text, textInfoContent, textChilds) {

    return Backbone.View.extend({
        template: _.template(text),
        templateInfoContent: _.template(textInfoContent),
        templateChilds: _.template(textChilds),
        region: {
            holder: '#main',
            scroller: '#content',
            content: '#edit-profile-content'
        },
        events: {
            'change #user_form_gender': 'onChangeGender',
            'change #user_form_location': 'onChangeLocation',
            'click #save_btn': 'submitForm',
            'click #user_form_birthday': 'handleDates'
        },
        render: function() {

            this.$holder = $(this.region.holder);

            this.$el.html(this.template());

            this.$scroller = this.$el.find(this.region.scroller);

            this.$contentHolder = this.$el.find(this.region.content);

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
                iUserId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('user/formeditprofile', postData, settings).done(this.fetchDone).fail(this.fetchFail);
        },
        fetchDone: function(data, status, jqXHR) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            this.fetchSuccess(data);
        },
        fetchSuccess: function(data) {

            this.formData = {
                aLocations: data.aLocations,
                bActiveAboutMe: data.bActiveAboutMe
            };

            this.model.set(data.info);

            this.refreshView();

            utils.observer.trigger('user:update');
        },
        fetchFail: function(error) {

            utils.debug.warn('[FAIL] user/formeditprofile', error);
            utils.modal.alert(_t('Can not load data from server'));

            utils.history.back();
        },
        refreshView: function() {

            this.$contentHolder.html(this.templateInfoContent({
                item: this.model,
                data: this.formData
            }));

            this.fetchChilds(this.model.getCountryISO());

            this.$save_btn = this.$el.find('#save_btn');
            this.$user_form_aboutme = this.$el.find('#user_form_aboutme');
            this.$user_form_birthday = this.$el.find('#user_form_birthday');
            this.$user_form_city = this.$el.find('#user_form_city');
            this.$user_form_gender = this.$el.find('#user_form_gender');
            this.$user_form_location = this.$el.find('#user_form_location');
            this.$user_form_zippostalcode = this.$el.find('#user_form_zippostalcode');
            this.$user_form_childs_holder = this.$el.find('#user_form_childs_holder');

            this.toggleSaveBtn();
        },
        onChangeGender: function(evt) {

            this.toggleSaveBtn();
        },
        onChangeLocation: function(evt) {

            this.toggleSaveBtn();

            this.$user_form_childs_holder.empty();

            var $target = $(evt.currentTarget);

            this.fetchChilds($target.val());
        },
        fetchChilds: function(sCountryIso) {

            var postData = {
                sCountryIso: sCountryIso
            };
            var settings = {
                context: this
            };

            utils.api.get('core/getchilds', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load country childs'));
                }

                this.updateChilds(data);
            }).fail(function(error) {
                utils.debug.warn('[FAIL] core/getchilds', error);
                return utils.modal.alert(_t('Can not load country childs'));
            });
        },
        updateChilds: function(data) {

            if (data.length > 0) {
                this.$user_form_childs_holder.html(this.templateChilds({
                    item: this.model,
                    data: data
                }));
            }
        },
        submitForm: function(evt) {

            if (this.$save_btn.hasClass('processing')) {
                return;
            }

            if (!this.$user_form_location.val()) {
                return utils.modal.alert('Please select Location.');
            }

            if (!this.$user_form_gender.val()) {
                return utils.modal.alert('Please select Gender.');
            }

            this.$user_form_childs = this.$el.find('#user_form_childs');

            var postData = {
                iCountryChildId: this.$user_form_childs.length > 0 ? this.$user_form_childs.val() : 0,
                iGender: this.$user_form_gender.val(),
                iUserId: this.model.getId(),
                sAbout: this.$user_form_aboutme.val(),
                sBirthday: this.$user_form_birthday.val(),
                sCity: this.$user_form_city.val(),
                sCountryIso: this.$user_form_location.val(),
                sZipCode: this.$user_form_zippostalcode.val()
            };

            var settings = {
                'context': this
            };

            this.$save_btn.addClass('processing');

            utils.api.post('user/edit_profile', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                this.saveSuccess();
            }).always(function() {
                this.$save_btn.removeClass('processing');
            });
        },
        saveSuccess: function() {

            utils.observer.trigger('user:update');
            utils.modal.toast('Edit Successfully');

            utils.history.back();
        },
        handleDates: function(evt) {
            if (constants.platform == 'android') {
                this.handleDatesAndroid(evt);
            } else {
                this.handleDatesiOS(evt);
            }
        },
        handleDatesiOS: function(evt) {
            var currentField = $(evt.currentTarget);

            var myNewDate = Date.parse(currentField.val().replace(/-/g, '/')) || new Date();
            if (typeof myNewDate === "number") {
                myNewDate = new Date(myNewDate);
            }

            var minYear = utils.setting.get('user_date_of_birth_start');
            var maxYear = utils.setting.get('user_date_of_birth_end');
            var minDate = new Date(minYear, 0, 1, 0, 0, 0);
            var maxDate = new Date(maxYear, 11, 31, 23, 59, 59);

            if (myNewDate.getTime() > maxDate.getTime()) {
                myNewDate = maxDate;
            } else if (myNewDate.getTime() < minDate.getTime()) {
                myNewDate = minDate;
            }
            currentField.val(utils.moment(myNewDate.getTime()).format('YYYY-MM-DD'));

            datePicker.show({
                date: myNewDate,
                minDate: minDate,
                maxDate: maxDate,
                mode: 'date'
            }, function(returnDate) {
                if (returnDate !== "" && returnDate != "Invalid Date") {
                    var newDate = new Date(returnDate);
                    // fix case date picker return wrong selected value
                    if (newDate.getTime() > maxDate.getTime()) {
                        newDate = maxDate;
                    } else if (newDate.getTime() < minDate.getTime()) {
                        newDate = minDate;
                    }
                    currentField.val(utils.moment(newDate.getTime()).format('YYYY-MM-DD'));
                }
                currentField.blur();
            });
        },
        handleDatesAndroid: function(evt) {
            var currentField = $(evt.currentTarget);

            var myNewDate = Date.parse(currentField.val().replace(/-/g, '/')) || new Date();
            if (typeof myNewDate === "number") {
                myNewDate = new Date(myNewDate);
            }

            var minYear = utils.setting.get('user_date_of_birth_start');
            var maxYear = utils.setting.get('user_date_of_birth_end');
            var minDate = Date.parse(minYear + '/01/01 00:00:00');
            var maxDate = Date.parse(maxYear + '/12/31 23:59:59');

            if (myNewDate.getTime() > maxDate) {
                myNewDate.setTime(maxDate);
            } else if (myNewDate.getTime() < minDate) {
                myNewDate.setTime(minDate);
            }
            currentField.val(utils.moment(myNewDate.getTime()).format('YYYY-MM-DD'));

            datePicker.show({
                date: myNewDate,
                minDate: minDate,
                maxDate: maxDate,
                mode: 'date'
            }, function(returnDate) {
                if (returnDate !== "" && returnDate != "Invalid Date") {
                    var newDate = new Date(returnDate);
                    // fix case date picker return wrong selected value
                    if (newDate.getTime() > maxDate) {
                        newDate.setTime(maxDate);
                    } else if (newDate.getTime() < minDate) {
                        newDate.setTime(minDate);
                    }
                    currentField.val(utils.moment(newDate.getTime()).format('YYYY-MM-DD'));
                }
                currentField.blur();
            });
        },
        toggleSaveBtn: function() {

            var bDisable = (!this.$user_form_location.val() || !this.$user_form_gender.val());

            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});