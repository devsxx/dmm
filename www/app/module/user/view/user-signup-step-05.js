define([ // Page Like Suggestions << Nay
    'text!user/tpl/user-signup-step-05.html',
    'user/plugin/signup-data',
    'core'
], function() {

    var text = require('text!user/tpl/user-signup-step-05.html'),
        signupData = require('user/plugin/signup-data'),
        core = require('core');

    return Backbone.View.extend({
        initialize: function() {
            
        },
        region: {
            wrapper: '#main',
            scroller: '#content'
        },
        events: {
            'click #cancel_btn': 'onCancelClick',
            'click #btn-next': 'goNext'
        },
        template: _.template(text),
        goNext: function() {
            var self = this;
            utils.debug.log("post data to completed signup form.");

            //to login page 
            //self.quickLogin(signupData.loginInfo);
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
        quickLogin: function(data) {

            constants.token = data.token;

            core.viewer.set(data);

            localStorage.setItem('token', data.token);

            localStorage.setItem('viewer', JSON.stringify(data));

            var iPackageId = signupData.all.iPackageId;

            signupData.reset();

            if (data.iPurchaseId){         // go to purchase if a package was selected

                window.location.href='#subscribe/' + iPackageId + '/' + data.iPurchaseId;

                return;
            } else {

                utils.modal.toast('Signup sucessfully');
                window.location.href = constants.home;
                window.location.reload();
            }
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

