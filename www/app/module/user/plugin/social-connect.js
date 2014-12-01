define([
    'user/plugin/signup-data',
    'user/model/user',
    'core'
], function() {

    var signupData = require('user/plugin/signup-data'),
        User = require('user/model/user'),
        core = require('core')

        // Constructer defines properties and inits object
        var SocialConnect = function(type, connect_url) {

            this._type = type;
            this._connect_url = encodeURI(connect_url);
            this._id = null;
            this._token = null;
            this._token_secret = null;


    }

    SocialConnect.prototype = {

        connect: function() {

            var token = '';
            var token_secret = '';
            var self = this;

            window.localStorage.setItem("sLoginBy", self._type);

            // Open social connect in InappBrowser
            var ref = window.open(encodeURI(self._connect_url), '_blank', 'location=no, status=no');

            // Add handler for loadstop event
            ref.addEventListener('loadstop', function(evt) {

                var url = decodeURI(evt.url);
                utils.debug.log('Callback URL: ' + url);

                switch (self._type) {

                    case 'facebook':
                        token = /[\?\&]access_token=([^&]+)/.exec(url);
                        // var user_id = /[\?\&]user_id=([^&]+)/.exec(url);
                        var error = /\?error=(.+)$/.exec(url);
                        utils.debug.log(token);
                        if (token) {
                            ref.close();
                            self._token = token[1];

                            self.getFacebookProfile();
                        } else {
                            // token = /[\?\&]confirm_token=([^&]+)/.exec(url);
                            // // var user_id = /[\?\&]user_id=([^&]+)/.exec(url);
                            // var error = /\?error=(.+)$/.exec(url);
                            // utils.debug.log(token);
                            // if (token){
                            //     ref.close();
                            //     self._token = token[1];
                            //     
                            //     self.getFacebookProfile();
                            // }

                        }

                        // Connect fail
                        if (error) {
                            // console.log(self._type + ' connect error: ' + JSON.stringify(error));
                            navigator.notification.alert(self._type + ' connect error: ' + JSON.stringify(error));
                        }
                        break;

                    case 'twitter':
                        token = /[\?\&]access_token=([^&]+)/.exec(url);
                        token_secret = /[\?\&]secret_token=([^&]+)/.exec(url);
                        json_data = /[\?\&]json_data=([^&]+)/.exec(url);
                        error = /\?error=(.+)$/.exec(url);

                        if (token && token_secret) {
                            ref.close();
                            self._token = token[1];
                            self._token_secret = token_secret[1];

                            var data = JSON.parse(decodeURIComponent(json_data[1]));
                            if (data.id) {
                                self._id = data.id;
                                var name = data.name.split('+');
                                var json = {
                                    'id': data.id,
                                    'email': '',
                                    'first_name': name[0],
                                    'last_name': name[1],
                                    'username': data.screen_name
                                };
                                // console.log(json);
                                self.processLogin(json);
                            }

                        }

                        // Connect fail
                        if (error) {
                            // console.log(self._type + ' connect error: ' + JSON.stringify(error));
                            navigator.notification.alert(self._type + ' connect error: ' + JSON.stringify(error));
                        }
                        break;

                    case 'linkedin':
                        break;

                    default:
                        break;

                }

            });

        },

        getFacebookProfile: function() {
            utils.debug.log(this);
            var self = this;

            $.ajax({
                url: 'https://graph.facebook.com/me',
                data: {
                    'access_token': this._token
                },
                dataType: 'json',
                success: function(data) {
                    // console.log(JSON.stringify(data));

                    self.processLogin(data);
                },
                error: function(error) {
                    // console.log('Get Facebook Profile fail: ' + JSON.stringify(error));
                    navigator.notification.alert(JSON.stringify(error));

                    errorCallback(error);
                },
                // complete: function(){},
                // beforeSend: function(){}
            });

        },

        getTwitterProfile: function() {


        },

        quickLogin: function(data) {
            constants.token = data.token;

            core.viewer.set(data);

            localStorage.setItem('token', data.token);

            localStorage.setItem('viewer', JSON.stringify(data));

            window.location.href = '#newsfeed';
            window.location.reload();
        },

        processLogin: function(jsonData) {

            var sApi = "user/login";
            var jData = {
                "sLoginBy": this._type,
                "sEmail": jsonData.email,
                "sLoginUID": jsonData.id,
                'sAccessToken': this._token,
                'sSecretToken': this._token_secret
            };
            var self = this;
            console.log(JSON.stringify(jsonData));
            // Try to login
            utils.api.post(sApi, jData).done(function(resData) {

                if (resData == null) {
                    navigator.notification.alert("Cannot connect to server");
                    return;
                }

                if (resData.token != null) {

                    self.quickLogin(resData);
                    // window.localStorage.setItem("user.user_id", resData.user_id);
                    // window.localStorage.setItem("user.full_name", resData.full_name);
                    // window.localStorage.setItem("user.user_name", resData.user_name);
                    // window.localStorage.setItem("user.profileimage", resData.profileimage);
                    // window.localStorage.setItem("token", resData.token);
                    // window.localStorage.setItem("user.bIsAdmin", resData.bIsAdmin);

                    // window.localStorage.setItem("sLoginUID", jsonData.id);

                    // if (sDeviceFilePath == 'ipad/') {
                    //     $('.login_page').addClass("loading");
                    //     $('.over_lay').hide();
                    //     $('#loading_signin').show();
                    // } else {
                    //     $('.login_form').hide();
                    //     $('.bottom_login').hide();
                    //     $('.logo_container').css({'background-position': 'center 25%', 'height': ($(window).height()-89)+'px'});
                    // }

                    // setTimeout(function () {
                    //     startApp();
                    // }, 200);

                } else {
                    // Account do not exists, signup new account
                    utils.modal.toast("This account does not exists, please create a new one.");

                    var user = new User(jsonData);
                    // console.log(user);
                    signupData.update({
                        sFirstName: user.getFirstName(),
                        sFullName: user.getFirstName() + ' ' + user.getLastName(),
                        sUserName: user.getUserName(),
                        sEmail: user.getEmail(),
                        sLastName: user.getLastName(),
                        iGender: jsonData.gender == 'male' ? 1 : (jsonData.gender == 'female' ? 0 : 2),
                        sLoginUID: user.getId(),
                        sAccessToken: self._token,
                        sSecretToken: self._token_secret,
                        sFacebook: jsonData.link,
                        sLoginBy: self._type
                    });

                    window.location = '#signup';

                    // if (jsonData.id != null && jsonData.id != ''){
                    //     window.localStorage.setItem("sLoginUID", jsonData.id);
                    // }

                    // if (jsonData.email != null && jsonData.email != ''){
                    //     window.localStorage.setItem("email", jsonData.email);
                    // }

                    // if (jsonData.username != null && jsonData.username != ''){
                    //     window.localStorage.setItem("username", jsonData.username);
                    // }

                    // if (jsonData.first_name != null && jsonData.first_name != ''){
                    //     window.localStorage.setItem("firstname", jsonData.first_name);
                    // }

                    // if (jsonData.last_name != null && jsonData.last_name != ''){
                    //     window.localStorage.setItem("lastname", jsonData.last_name);
                    // }

                    // if (jsonData.gender != null && jsonData.gender != ''){
                    //     window.localStorage.setItem("gender", jsonData.gender);
                    // }

                    // if (jsonData.timezone != null && jsonData.timezone != ''){
                    //     window.localStorage.setItem("timezone", jsonData.timezone);
                    // }

                    // if (jsonData.signup_facebook != null && jsonData.signup_facebook != ''){
                    //     window.localStorage.setItem("signup_facebook", jsonData.signup_facebook);
                    // }

                    // // Open signup form
                    // $("#main-container").html( ( new SignupView() ).render().el );

                }

            });

        }

    }

    return SocialConnect;

});