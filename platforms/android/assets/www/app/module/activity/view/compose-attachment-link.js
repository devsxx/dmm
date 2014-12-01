define([
    'text!activity/tpl/compose-attachment-link.html',
    'text!activity/tpl/attachment-link.html'
], function() { 
    var tpl = require('text!activity/tpl/compose-attachment-link.html')
      , attachmentTpl = require('text!activity/tpl/attachment-link.html');


    var AttachmentLink = Backbone.View.extend({
        region: {
			main: '#simple-popup', // main region is where the html contain is injected
            attachment_holder: '#compose_status_select_attachment_holder'
        },
        events: {
            'click #submit_link_btn': 'submitLink'
        },
		template : _.template(tpl),
        render: function() {
            this.$el.html(this.template());
            
            // initialize jquery variables
            this.$postBtn = $('#submit_link_btn', this.$el); // this variable is the same as many view for copy/paste purpose :)
            this.$linkUrl = $('#link_url', this.$el);

            return this;
        },

        inject: function() { 
            
            utils.popup.open(this.$el);
			
			return this;
        },
        
        close: function() {
		    utils.popup.close();	
			
			return this;
        },

        submitLink: function() {
            if(this.$postBtn.hasClass('processing')) {
                return false;
            }

            if(!this.isLinkValidate())  {
                return false;
            }

            var data = {
                sLink: utils.helper.checkToAddHttpIntoLinkIfNeccessary(this.$linkUrl.val())
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('link/preview', data, settings).done(this.postDone).always(this.postComplete);

        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.$postBtn.removeClass('processing');
            this.$postBtn.val('Save');
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$postBtn.addClass('processing');
            this.$postBtn.val('Saving...');
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post link failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        isLinkValidate: function() {

            if(this.$linkUrl.val().trim() === '') {
                utils.modal.alert('Please enter your link');
                return false;
            }

            return true;
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postSuccess: function (data) {

            var model = {
                sDefaultImage: data.sDefaultImage,
                sTitle: data.sTitle,
                sLink: data.sLink,
                sDescription: data.sDescription
            }
              , tpl = _.template(attachmentTpl)
              , attachmentHtml = tpl(model);


            utils.observer.trigger('attachment:success', {
                data: model, 
                html: attachmentHtml,
                type: 'link'
            });
            // this.region.attachment_holder.html(
            utils.modal.toast('Submit link successfully');
            this.close();
        },

    });

    return AttachmentLink;
});

