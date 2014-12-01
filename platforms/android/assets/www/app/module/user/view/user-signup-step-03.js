define([ //User Profile Image 
    'text!user/tpl/user-signup-step-03.html',
    'user/plugin/signup-data',
    'user/view/select-crop-image',
    'core'
], function() {

    var SelectCropImageView = require('user/view/select-crop-image'),
        text = require('text!user/tpl/user-signup-step-03.html'),
        signupData = require('user/plugin/signup-data'),
        core = require('core');

    return Backbone.View.extend({
        initialize: function() {
            this.cropView = new SelectCropImageView();

        },
        region: {
            wrapper: '#main',
            scroller: '#content'
        },
        events: {
            'click #cancel_btn': 'onCancelClick',
            'click #reselect_btn': 'selectPhoto',
            'click #btn-next': 'goNext'
        },
        template: _.template(text),
        goNext: function() {
            var data = this.cropView.getData();
            signupData.update(data);

            utils.debug.log("post data to completed signup form.");

            this.postSignupForm();
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

            this.selectPhoto();

            return this;
        },

        selectPhoto: function(evt) {

            var self = this;

            if(!navigator.camera){
                //looks like we are on development mode, let's skip this one
                 window.location.href='#signup/step04';
                 return;
            }

            var onSuccess = function(imageURI) {
                self.$el.find('#signup-form-edit-avatar').html(self.cropView.render({
                    imageURI: imageURI
                }).el);
            };

            var onFail = function(msg) {
                utils.modal.alert(msg);
                utils.history.back();
            };

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            });
        },

        postSignupForm: function() {
            if (this.$postBtn.hasClass('processing')) return;

            var self = this;

            function done(data) {

                if (parseInt(data.error_code, 10) > 0) {
                    if (data.error_code == 4 || data.error_code == 5) { // need to verify email or admin approve
                        utils.modal.alert(data.error_message);
                        window.location.href = '#login';
                     // window.location.href='#signup/step04';
                        return;
                    } else {
                        utils.modal.alert(data.error_message || 'Post URL failed!');
                        window.location = '#signup/step01';
                        return;
                    }
                } else {
                    
                    window.location.href='#signup/step04';
                    self.quickLogin(data);   // let's login at final stage << Nay
                }
            };

            function fail(error) {
                utils.modal.alert('Cannot Create Account! ');
                utils.debug.error('Error uploading file: ' + JSON.stringify(error));

                // self.handleUploadPhotoSuccess(data, settings, result);
            };

            function always() {
                self.$postBtn.removeClass('processing');
            }

            // console.log(signupData);
            this.$postBtn.addClass('processing');

            var params = signupData.all;

            utils.api.uploadImage('user/signup_account', params.sImgSrc, params).done(done).fail(fail).always(always);
        },

        quickLogin: function(data) {

            constants.token = data.token;

            core.viewer.set(data);

            localStorage.setItem('token', data.token);

            localStorage.setItem('viewer', JSON.stringify(data));

            // var iPackageId = signupData.all.iPackageId;

            // signupData.reset();

            // if (data.iPurchaseId){         // go to purchase if a package was selected

            //     window.location.href='#subscribe/' + iPackageId + '/' + data.iPurchaseId;

            //     return;
            // } else {

            //     utils.modal.toast('Signup sucessfully');
            //     window.location.href = constants.home;
            //     window.location.reload();
            // }

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

/**
 * response if signing up successfully
 *email: "fdsaf1@fdasfa.com"
 error_code: 0
 full_name: "fdaf fdasf"
 profileimage: "http://product-dev.younetco.com/mobile/se460/public/user/70/0c/0c64_ab60.jpg?c=9c9e"
 result: 1
 token: "wyduXY9dB0ECL30pVjFz0cTP"
 user_id: 164
 user_name: "Fdasfdsafsda1"
 */