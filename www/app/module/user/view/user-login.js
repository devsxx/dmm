define([
    'core',
    'user/plugin/social-connect',
     'user/plugin/signup-data',
     'user/model/user',
    'text!user/tpl/user-login.html'
], function(core, SocialConnect, signupData,User, text) {
    
    var facebookToken = null;
    var facebookPermissions = ["email","user_friends","user_birthday"];
    
    function facebookLogoutThenLogin(){
        utils.debug.log('logout to facebook then login');
        facebookConnectPlugin.logout(function(){
            loginToFacebook();
        },function(){
            utils.debug.log('error when logout from facebook');
            utils.debug.log(arguments);
            loginToFacebook();
        });
    }
    
    function loginToFacebook(){
        utils.debug.log('login to facebook');
        facebookConnectPlugin.login(facebookPermissions, getFbProfileInfo, function(msg){
            utils.modal.alert(msg);
        },function(){
            alert(JSON.stringify(arguments));
        });
    }
    
    function getFacebookAccessTokenThenLogin(){
        facebookConnectPlugin.getAccessToken(function(token){
            facebookToken =  token;
            getFbProfileInfo();
        },function(failed){
            utils.debug.log('could not get facebook access token '+ failed);
            loginToFacebook();
        });
    }
    
    function getFbProfileInfo(data){
//           
          if(data && data.hasOwnProperty('authResponse'))
            facebookToken = data.authResponse.accessToken;
         
          utils.debug.log('getting facebook profile info  '+ JSON.stringify(data));
          
          facebookConnectPlugin.api('me/?fields=id,email,birthday,first_name,last_name,timezone,languages,name,gender', [],
        
            processLoginByFacebook,
        
            function () {
                utils.debug.log(arguments);
            });  
        }
        
    function quickLogin(data) {
            constants.token = data.token;

            core.viewer.set(data);

            localStorage.setItem('token', data.token);

            localStorage.setItem('viewer', JSON.stringify(data));

            window.location.href = '#newsfeed';
            window.location.reload();
        }
        
    function processLoginByFacebook(jsonData) {
            utils.debug.log('process login by facebook '+ JSON.stringify(jsonData));
            
            var sApi = "user/login";
            
            var jData = {
                "sLoginBy": 'facebook',
            //    "sPhone": jsonData.phone,
                "sEmail": jsonData.email,
                "sLoginUID": jsonData.id,
                'sAccessToken': facebookToken,
            };

            utils.debug.log(JSON.stringify(jData));
            // Try to login
            utils.api.post(sApi, jData).done(function(resData) {

                if (resData == null) {
                    navigator.notification.alert("Cannot connect to server");
                    return;
                }

                if (resData.token != null) {

                    quickLogin(resData);

                } else {
                    console.log(JSON.stringify(resData));
                    // Account do not exists, signup new account
                    utils.modal.toast("This account does not exists, please create a new one.");

                    var user = new User(jsonData);
                    // console.log(user);
                    
                    var sBirthday = jsonData.birthday;
                    
                    if(sBirthday){
                        var ar = sBirthday.split('/');
                        // fb reurn 'mm/dd/yyyy'
                        sBirthday = ar[2] + '-' + ar[0] + '-'+ ar[1];
                    }
                    
                    var updateData = {
                        sFirstName: user.getFirstName(),
                        sFullName: jsonData.name,
                        sUserName: user.getUserName(),
                        sBirthday: sBirthday,
                        sPhone: user.getPhone(),
                        sEmail: user.getEmail(),
                        sLastName: user.getLastName(),
                        iGender: jsonData.gender == 'male' ? 1 : (jsonData.gender == 'female' ? 0 : 2),
                        sLoginUID: user.getId(),
                        sAccessToken: facebookToken,
                        sSecretToken: '',
                        sFacebook: '',
                        sLoginBy: 'facebook'
                    };
                    
                    signupData.update(updateData);
                    
                    console.log(JSON.stringify(updateData));

                    window.location = '#signup';
                }

            }).fail(function(){
                utils.modal.alert('can not process login by facebook');
            });

        }

    return Backbone.View.extend({
        region: {
            wrapper: '#main',
            scroller: '#content',
            form: '#login-form'
        },
        className: 'page user-login-page',
        template: _.template(text),
        doLogin: function(evt) {

            var self = this;

            var btnLogin = $(evt.currentTarget),
                form = $(this.region.form),
                $ele = $(this.el);

            //'check login view';
            if (form.data('lock')) {
                return;
            }

            var email = form.find('#email').val();
            var phone = form.find("#phone").val();
            var password = form.find('#password').val();

            if (!email && !phone) {
                utils.modal.alert('Please enter email or phone number');
                return;
            }

            if (!utils.validator.isEmail(email)) {
                utils.modal.alert('Please enter a valid email address');
                return;
            }

            if (!password) {
                utils.modal.alert('Password is empty!');
                return;
            }

            var post_data = {
                sPhone:phone,
                sEmail: email,
                sPassword: password
            }

            form.data('lock', true);

            // login successfull
            $ele.addClass('signin-loading');
            // btnLogin.text('Signing In ...');


            // block ui.
            utils.observer.trigger('blockui');

            utils.api.get('user/login', post_data)
                .done(function(data) {
                    if (data.hasOwnProperty('token') && data.hasOwnProperty('user_id')) {

                        utils.debug.log('user logged in', data);

                        // update main data at first.
                        constants.token = data.token;

                        core.viewer.set(data);

                        localStorage.setItem('token', data.token);

                        localStorage.setItem('viewer', JSON.stringify(data));

                        $.ajaxSetup({
                            headers: {
                                token: data.token
                            }
                        });

                        self.checkSubscription(data);
                    } else {
                        utils.modal.alert(data.error_message);
                    }
                    // trigger to login view.
                }).fail(function(result) {
                    utils.debug.log(arguments);
                }).always(function(result) {
                    // release ui blocked
                    $ele.removeClass('signin-loading');
                    utils.observer.trigger('releaseui');
                    btnLogin.text('Sign In');
                    form.data('lock', false);

                });
        },
        render: function(context) {
            
            this.$el.html(this.template(context));

            // fix footer of login page
            this.$el.find(".footer").css({
                top: window.baseMinHeight - 67
            });
            this.$el.css({
                'min-height': window.baseMinHeight
            });

            this.$scroller = this.$el.find(this.region.scroller);

            return this;
        },
        inject: function() {

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            return this;
        },
        events: {
            'click #btn-login': 'doLogin',
            'click #login_by_facebook_btn': 'checkLoginStatus',
            'click #login_by_twitter_btn': 'loginByTwitter'
        },
       checkLoginStatus: function() {
            facebookConnectPlugin.getLoginStatus(function(response){
                switch(response.status){
                    case 'connected': 
                        utils.debug.log('facebook now connected');
                        facebookLogoutThenLogin();
                        // getFacebookAccessTokenThenLogin();
                        break;
                    case 'unknown':
                    default:
                        // process login to facebook
                        // loginToFacebook();
                        loginToFacebook();
                        utils.debug.log('facebook connect status ' +  response.status);    
                }
            },function(){
                utils.debug.log(JSON.stringify(arguments));
                getFacebookAccessTokenThenLogin();
            });
            
            
            // issue with anroid, does not know #,?
            // var social = new SocialConnect('facebook', 'social-connect-facebook.html');
            // social.connect();
            // /Users/namnv/Sites/mobile/phpfox/trunk/phonegap-facebook-plugin
        },
        loginByTwitter: function() {
            var social = new SocialConnect('twitter', 'social-connect-twitter.html');
            social.connect();
        },
        checkSubscription: function (loginData){

            utils.api.get('user/verify_account',{},{context: this,'async':false})
                .done(function(data){
                    if(data.error_code && data.error_code > 0){

                        //check if user is subscribed
                        if (data.error_code == 1 && data.iPurchaseId){
                            window.location.href = '#subscribe/' + data.iPackageId + '/' + data.iPurchaseId;

                        } else {
                            window.location.href = '#logout';
                        }
                    }else{
                        // trigger observer
                        utils.observer.trigger('user:login', loginData);

                        // redirect to newsfeed page.
                        window.location.href = constants.home;
                    }
                })
                .fail(function(){
                    window.location.href = '#logout';
                })
            ;
        }
    });
});