define([
    'attachment/model/attachment-link',
    'text!attachment/tpl/attachment-form-link.html'
], function(LinkModel, text) {

    var AttachmentLink = Backbone.View.extend({
        region: {
            main: '#simple-popup', // main region is where the html contain is injected
        },
        events: {
            'click #submit_link_btn': 'submitLink'
        },
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                sModule: null
            }, context);

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

            if (this.$postBtn.hasClass('processing')) {
                return false;
            }

            if (!this.isLinkValidate()) {
                return false;
            }

            var data = {
                sModule: this.context.sModule,
                sUrl: utils.helper.checkToAddHttpIntoLinkIfNeccessary(this.$linkUrl.val())
            };
            var settings = {
                'context': this,
                'beforeSend': this.beforeSend
            };

            utils.api.post('attachment/attachlink', data, settings).done(this.postDone).always(this.postComplete);
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
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post link failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },
        isLinkValidate: function() {

            if (this.$linkUrl.val().trim() === '') {
                utils.modal.alert('Please enter your link');
                return false;
            }

            return true;
        },
        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function(data) {

            var link = new LinkModel(data.link_data);

            this.trigger('attachsuccess', link);

            this.close();
        }
    });

    return AttachmentLink;
});