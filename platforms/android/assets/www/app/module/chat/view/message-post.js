define([
    'text!chat/tpl/message-post.html',
    'chat/model/message',
    'core'
], function() { 
    var text = require('text!chat/tpl/message-post.html')
      , Message = require('chat/model/message')
      , core = require('core')

    var PostView = Backbone.View.extend({
        template: _.template(text),
        region:{
            main: '#message-post-holder'
        },
        events: {
            'click #send_btn': 'sendMessage',
            'keyup #message': 'handleMessageChange'
        },
        render: function() {
            this.$el.html(this.template());
            this.$postBtn = $('#send_btn', this.$el);
            this.$message = $('#message', this.$el);

            return this;
        },
        inject: function() {
            var main = $(this.region.main);
            
            main.html(this.el);

            return this;
        },

        handleMessageChange: function() {
            if(this.$message.val().trim() == '') {
                this.$postBtn.addClass('disabled');
            } else {
                this.$postBtn.removeClass('disabled');
            }
        },

        isValidate: function() {
            if(this.$message.val().trim() === '') {
                utils.modal.alert(_t('Message cannot be empty'));
                return false;
            }

            return true;
        },

        sendMessage: function() {
            if(!this.isValidate()) return;

            if(this.$postBtn.isProcessing()) return;

            var data = {
                'sMessage': this.$message.val(),
                'iItemId' : this.model.getId(),
                'sItemType': this.model.getType(),
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            var message = $.extend({
                'iSenderId': core.viewer.getId(),
                'sSendStatus': 'sending',
                'bNeedToScroll': true
            }, data);

            this.newMessage = new Message(message);
            this.model.getMessages().add(this.newMessage);
            // .trigger('add-posted-message', this.newMessage);

            this.$message.val('');
            this.$postBtn.addClass('disabled');

            utils.api.post('chat/sendmessage', data, settings).done(this.postDone).always(this.postComplete).fail(this.postFail);
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
                utils.modal.alert(data.error_message || _t('Post URL failed!')); //defensive programming
                this.postFail();
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postSuccess: function (data) {
            data.sSendStatus = 'done';
            this.newMessage.set(data).collection.trigger('new-message-appended-success', this.newMessage);
        },

        postFail: function() {
            this.newMessage.set({
                'sSendStatus': 'Message was not delivered',
                'sSendStatusType': 'error'
            });
            // this.newMessage.set('sSendStatus', 'Message was not delivered');
        }

    });

    return PostView;
});

