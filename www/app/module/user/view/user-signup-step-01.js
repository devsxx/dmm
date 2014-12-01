define([   //Display Signup Form
    'text!user/tpl/user-signup-step-01.html',
    'user/plugin/signup-data',
    'subscribe/model/subscription',
    'user/view/term-condition'
],function(text, signupData, Model){

    return Backbone.View.extend({
        region: {
            wrapper: '#main',
            scroller: '#content'
        },
        termConditionView: require('user/view/term-condition'),
        events: {
            'click #view-subscription-link': 'onSubscriptionViewClick',
            'click #cancel_btn': 'onCancelClick',
            'click #btn-next': 'goNext',
            'click #term-condition-link': 'showTermCondition',
            'click #signup-birthday': 'handleDates'
        },
        template: _.template(text),
        goNext: function(evt){
            var $target = $(evt.currentTarget);

             window.location.href='#signup/step04'; //no step 4 -- testing facebook
             return;

            if ($target.hasClass('processing')) {
                return;
            }

            var dom =  this.$el;

            var sFullname        = dom.find('#signup-fullname').val();
            var sEmail           = dom.find('#signup-email').val();
            var sPassword        = dom.find('#signup-password').val();
            var sPasswordConfirm = dom.find('#signup-confirm').val();
            var iGender          = dom.find('#signup-gender').val();
            var sBirthday        = dom.find('#signup-birthday').val();
            var bIsChecked       = dom.find('#term-condition-checkbox').is(':checked');

            var $fullname        = dom.find('#signup-username');
            var $password        = dom.find('#signup-password');
            var $passwordConfirm = dom.find('#signup-confirm');
            var $mail            = dom.find('#signup-email');
            var $birthday        = dom.find('#signup-birthday');
            // get subscription package

            var iPackageId = this.$subscriptionSelect.val() || 0;

            $password.removeClass('error');
            $passwordConfirm.removeClass('error');
            $mail.removeClass('error');
            $birthday.removeClass('error');

            if(!sFullname){
                $fullname.addClass('error');
                utils.modal.alert(_t('Fullname can not be empty!'));
                return ;
            }


            if(!sEmail){
                $mail.addClass('error');
                utils.modal.alert(_t('Email can not be null!'));
                return ;
            } else {
                if(!utils.validator.isEmail(sEmail)){
                    $mail.addClass('error');
                    utils.modal.alert(_t('Email is not valid!'));
                    return ;
                }
            }

            if(!sPassword){
                $password.addClass('error');
                utils.modal.alert(_t('Password can not be empty!'));
                return ;
            }

            if (sPassword.indexOf(' ') > -1) {
                $password.addClass('error');
                utils.modal.alert(_t('Password should not contain space'));
                return ;
            }

            if (sPassword.length < 6) {
                $password.addClass('error');
                utils.modal.alert(_t('Password must be longer than 6'));
                return;
            }

            if(!sPasswordConfirm || sPasswordConfirm != sPassword){
                $passwordConfirm.addClass('error');
                utils.modal.alert(_t('Password does not match'));
                return ;
            }

            // var datePatt = /(\d{4}-\d{2}-\d{2})$/;
            // if (!datePatt.test(sBirthday)) {
            // 	$birthday.addClass('error');
            // 	utils.modal.alert("Please select birthday");
            // 	return;
            // }

            if(!bIsChecked) {
                utils.modal.alert(_t('You must agree to the terms of service to continue'));
                return ;
            }

            signupData.update({
                sEmail: sEmail,
                sPassword: sPassword,
                sFullName: sFullname,
                iGender: iGender,
                sBirthday: sBirthday,
                bIsAgreeTerms: bIsChecked,
                iPackageId: iPackageId
            });

            $target.addClass('processing');

            // var checkUserName = utils.api.post('user/signup_check_username', {sUserName: sUserName});
            var checkEmail = utils.api.post('user/signup_check_email', {sEmail: sEmail});

            // $.when(checkUserName, checkEmail).done(function (data1, data2) {
            $.when(checkEmail).done(function (data1) {
                // data1 = data1[0];
                // data2 = data2[0];


                if (data1.error_code > 0) {
                    utils.modal.alert(data1.error_message);
                    $mail.addClass('error');
                    return;
                }

                window.location.href='#signup/step03'; //no step 2

            }).always(function () {
                $target.removeClass('processing');
            });
        },
        render: function(context){
            var self = this;

            this.$el.html(this.template({data: signupData.all }));

            this.$scroller  = this.$el.find(this.region.scroller);

            this.$subscriptionGroup = this.$el.find('#signup_subscription_group');

            this.$subscriptionSelect = this.$el.find('#signup_subscription_package');

            // bind input edit, paste events
            this.$input_eles = $('input', this.$el);
            this.$input_eles.each(function () {
                $(this).bind('input propertychange', function () {
                    self.toggleBtn();
                });
            });

            this.fetchData();

            return this;
        },
        inject: function(){

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            return this;
        },
        showTermCondition: function(e) {
            new this.termConditionView().render().inject();
        },
        toggleBtn: function () {
            var bDisable = true;

            this.$input_eles.each(function () {
                if ($(this).attr("type") != "checkbox" && $(this).val() != "") {
                    bDisable = false;
                }
            });

            $('#btn-next').toggleClass('disabled', bDisable);
        },
        onCancelClick: function () {
            utils.modal.confirm(_t('No account will be created if you cancel this screen'), function (selected) {
                if (selected == 1) {
                    signupData.reset();
                    window.location.href = "#login";
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        },
        handleDates: function (evt) {
            if (constants.platform == 'android') {
                this.handleDatesAndroid(evt);
            } else {
                this.handleDatesiOS(evt);
            }
        },
        handleDatesiOS: function (evt) {
            var currentField = $(evt.currentTarget);

            var myNewDate = Date.parse(currentField.val().replace(/-/g, '/')) || new Date();
            if(typeof myNewDate === "number") {
                myNewDate = new Date (myNewDate);
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
                date : myNewDate,
                minDate: minDate,
                maxDate: maxDate,
                mode : 'date'
            }, function(returnDate) {
                if(returnDate !== "" && returnDate != "Invalid Date") {
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
        handleDatesAndroid: function (evt) {
            var currentField = $(evt.currentTarget);

            var myNewDate = Date.parse(currentField.val().replace(/-/g, '/')) || new Date();
            if(typeof myNewDate === "number") {
                myNewDate = new Date (myNewDate);
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
                date : myNewDate,
                minDate: minDate,
                maxDate: maxDate,
                mode : 'date'
            }, function(returnDate) {
                if(returnDate !== "" && returnDate != "Invalid Date") {
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
        fetchData: function () {
            // get data

            var settings  = {context: this};

            utils.api.get('user/getsubscriptionpackages', {}, settings)
                .done(this.fetchDataComplete)
                .fail(this.fetchDataFail);
        },
        fetchDataComplete: function (data) {

            var self = this;

            if(data.error_code && data.error_code > 0){

                utils.modal.alert(data.error_message);

                utils.history.back();
            }else{

                this.model = new Model();

                this.model.set(data);

                this.updateSubscription();
            }
        },
        fetchDataFail : function(error, msg) {

            msg = msg || _t('Could not fetch data');

            utils.modal.alert(msg);

            utils.history.back();
        },
        updateSubscription: function () {

            var self = this;

            var packages = this.model.getSubscriptionPackages();

            if (packages.length) {
                this.$subscriptionGroup.removeClass('hide');

                if (!this.model.subscribeIsRequiredOnSignUp()) {
                    this.$subscriptionSelect.append(new Option(_t('Free'), 0));
                }

                _.each(packages, function (package) {
                    self.$subscriptionSelect.append(new Option(package.sTitle, package.iPackageId));
                });

                // reasign pacakge
                if (signupData.all.iPackageId) {
                    this.$subscriptionSelect.val((signupData.all.iPackageId));
                }
            }
        },
        onSubscriptionViewClick: function () {

            // save signup data to fill in when backing from subscription packages view

            var dom =  this.$el;
            var sFullname        = dom.find('#signup-fullname').val();
            var sEmail           = dom.find('#signup-email').val();
            var sPassword        = dom.find('#signup-password').val();
            var iGender          = dom.find('#signup-gender').val();
            var sBirthday        = dom.find('#signup-birthday').val();
            var bIsChecked       = dom.find('#term-condition-checkbox').is(':checked');

            var iPackageId = this.$subscriptionSelect.val() || 0;

            signupData.update({
                sEmail: sEmail,
                sPassword: sPassword,
                sFullName: sFullname,
                iGender: iGender,
                sBirthday: sBirthday,
                bIsAgreeTerms: bIsChecked,
                iPackageId: iPackageId
            });
        }
    });
});
