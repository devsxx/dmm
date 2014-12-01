define([ //Friends Invitation << Nay 
    'text!user/tpl/user-signup-step-04.html',
    'user/plugin/signup-data',
    'core',
    'user/plugin/social-connect',     
    'user/model/user'
], function() {

    var text = require('text!user/tpl/user-signup-step-04.html'),
        signupData = require('user/plugin/signup-data'),
        core = require('core'),
        SocialConnect = require('user/plugin/social-connect'),
        User  = require('user/model/user');


    var facebookPermissions = ["email","user_friends","user_birthday"]; 

     function getFacebookAccessTokenThenLogin(){

        facebookConnectPlugin.getAccessToken(function(token){
            facebookToken =  token;         
            getFbProfileInfo();
        },function(failed){
            utils.debug.log('could not get facebook access token '+ failed);
            loginToFacebook();
        });
    }
    function friendDialog(){
    alert("friend dialog!");
    facebookConnectPlugin.showDialog( { method: "apprequests", message: "Hello EveryOne" });
    //facebookConnectPlugin.invite('Invitation message better be inviting', 'Invitation Title', successCallback, failureCallback);
    }
    function loginToFacebook(){
    
        alert('login to facebook');
        facebookConnectPlugin.login(facebookPermissions, getFbProfileInfo, function(msg){
            alert(msg);
        friendDialog();
         utils.modal.alert(msg);                   
        },function(){
            alert(JSON.stringify(arguments));
        });
    }    
    
    function getFbProfileInfo(data){
//           
          alert("getFbProfileInfo");
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
            //alert('quickLogin');
            friendDialog();
            window.location.href = '#pageviewselect';
            //window.location.href = '#newsfeed';
            //window.location.href = constants.fbinvite;
            //window.location.reload();
        }
        
    function processLoginByFacebook(jsonData) {
            alert("processLoginByFacebook");
            utils.debug.log('process login by facebook '+ JSON.stringify(jsonData));
            
            var sApi = "user/login";
            
            var jData = {
                "sLoginBy": 'facebook',
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
                        sEmail: user.getEmail(),
                        sPhone: user.getPhone(),
                        sLastName: user.getLastName(),
                        iGender: jsonData.gender == 'male' ? 1 : (jsonData.gender == 'female' ? 0 : 2),
                        sLoginUID: user.getId(),
                        sAccessToken: facebookToken,
                        sSecretToken: '',
                        sFacebook: '',
                        sLoginBy: 'facebook'
                    };                  
                    
                    console.log(JSON.stringify(updateData));                  
                }

            }).fail(function(){
                utils.modal.alert('can not process login by facebook');
            });

        }
        

    return Backbone.View.extend({
        initialize: function() {
            
        },
        region: {
            wrapper: '#main',
            scroller: '#content'
        },
        events: {
            'click #cancel_btn': 'onCancelClick',
            'click #btn-next': 'goNext',
            'click #friRequest': 'FBFriendRequestInit'
        },
        template: _.template(text),
        goNext: function() {
           
            utils.debug.log("post data to completed signup form.");
            //we don't have any data to save in this step :) 
            //to newsfeed
                 utils.modal.toast('Signup sucessfully');
                 window.location.href = constants.home;
                 window.location.reload();
        },
        render: function(context) {

            this.context = $.extend({
                data: signupData.all
            }, context);

            this.$el.html(this.template(this.context));

            this.$scroller = this.$el.find(this.region.scroller);

            return this;
        },
        inject: function() {

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.$postBtn = $('#btn-next');


            return this;
        },

        FBFriendRequestInit: function(){
            alert("clicked!");
        alert(facebookConnectPlugin);
         facebookConnectPlugin.getLoginStatus(function(response){
            alert(response.status);
                switch(response.status){
                    case 'connected': 
                        //alert('connected');
                        utils.debug.log('facebook now connected');
                        friendDialog();
                        break;
                    case 'unknown':
                    default:
                        //alert('default');                       
                        loginToFacebook();                      
                        utils.debug.log('facebook connect status ' +  response.status);
                        break;
                }
            },function(){
                alert("getLoginStatus error.");
                utils.debug.log(JSON.stringify(arguments));
                getFacebookAccessTokenThenLogin();
            }); 




        },
        onCancelClick: function() {
            utils.modal.confirm(_t('No account will be created if you cancel this screen'), function(selected) {
                if (selected == 1) {
                    signupData.reset();
                    window.location.href = "#login";
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        }
    });
});

