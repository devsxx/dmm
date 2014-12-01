define([
	'text!user/tpl/user-forgot-password.html'
],function(text){

	return Backbone.View.extend({
		region: {
			wrapper: '#main',
			scroller: '#content'
		},
        events: {
            'click #btn-send-email': 'sendEmail'
        },
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({}));
			
			this.$scroller = this.$el.find(this.region.scroller);
			
			return this;
		},
		inject: function(){
			
			$(this.region.wrapper).html(this.$el);

			this.$scroller.ensureVerticalScroll();
			
            this.$email = this.$el.find('#email_to_reset_password');

            this.$email.focus();
            
            this.$postBtn = this.$el.find('#btn-send-email');
			
			return this;
		},

        sendEmail: function(e) {
            if(!this.isValidate() || this.$postBtn.isProcessing()) {
                return ;
            }

            var data = {
                sEmail: this.$email.val()
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('user/forgot', data, settings).done(this.postDone).always(this.postComplete);

        },

        isValidate: function() {
            if(this.$email.val().trim() == '') {
            	var msg = 'Please enter your email';
				utils.modal.alert(msg);
				return false;
            }

            if(!utils.validator.isEmail(this.$email.val())) {
            	var msg = 'Please enter a valid email';
            	
            	utils.modal.alert(msg);
                return false;
            }

            return true;

        },
        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.$postBtn.isProcessing(false);
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$postBtn.isProcessing(true);
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postSuccess: function (data) {
        	var msg  =  _t('You have been sent an email with instructions how to reset your password. If the email does not arrive within several minutes, be sure to check your spam or junk mail folders.');
            utils.modal.alert(msg);
			utils.history.back();
        },
	});
});
