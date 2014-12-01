define([
    'text!user/tpl/term-condition.html'
], function(text) { 

   
   return Backbone.View.extend({
        template: _.template(text),
        events: {
            'click #btn-close-term-condition': 'closePopup'
        },
        region:{
        	scroller: '#popup-content',
        	holder: '#term_and_condition_content_holder'
        },

        render: function() {
            this.$el.html(this.template());
			
			this.$holder =  this.$el.find(this.region.holder);

            var settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('user/signup_term', {}, settings).done(this.postDone).always(this.postComplete);

            return this;
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
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
        	$(this.region.holder).html(data.message);
        },

        inject: function() {
            utils.popup.open(this.$el);
            
            this.$scroller.ensureVerticalScroll();
            
            return this;
        },

        closePopup: function() {
            utils.popup.close();
        }

    });
});

