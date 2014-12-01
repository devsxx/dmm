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

        FBFriendRequestInit: function(evt){
             var $target = $(evt.currentTarget);
             if($target.hasClass("processing")){return;}else{
                $target.addClass("processing");
             }

            var  fbAppRequestDialog = function (){
                            var options = { method:"apprequests", message: "Please Check out this app, buddy." };
                            facebookConnectPlugin.showDialog(options,
                                function (result) {
                                    utils.modal.alert("Thank You!");
                                    $("#friRequest").removeClass("processing");

                                                 },
                                function (e) {
                                    utils.modal.alert(JSON.stringify(e));
                                     $("#friRequest").removeClass("processing");
                            });
               };


            var fbLoginSuccess = function (userData) {

                    facebookConnectPlugin.getLoginStatus(
                        function (status) {
                            fbAppRequestDialog();
                        }
                    );

                };


            facebookConnectPlugin.getLoginStatus(function (status) {

                            var facebookPermissions = ["public_profile"];
                            alert(JSON.stringify(status.authResponse));
                            if(status.authResponse && status.authResponse.userID){
                                     fbAppRequestDialog();
                            }else {
                                  facebookConnectPlugin.login(facebookPermissions,
                                        fbLoginSuccess,
                                        function (error) { utils.modal.alert("login error : " + JSON.stringify(error)) }
                                    );
                            }
                            

                        },
                        function (e){

                        }
                    );




        },
        onCancelClick: function() {
            utils.modal.confirm(_t('Are you sure you want to skip this? '), function(selected) {
                if (selected == 1) {
                    signupData.reset();
                    window.location.href = "#login";
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        }
    });
});

