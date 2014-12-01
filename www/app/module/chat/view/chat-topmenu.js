define([
    'text!chat/tpl/chat-topmenu.html',
    'core'
], function(text) {
    var core = require('core')

    return Backbone.TopMenuView.extend({
        template: _.template(text),
        events: {
            'mute': 'muteNotification',
            'unmute': 'unmuteNotification',
            'toOnline': 'changeToOnline',
            'toOffline': 'changeToOffline',
        },
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        muteNotification: function() {
            utils.observer.trigger('chat:turn-off-notification');
            this.render();
        },

        changeToOnline: function() {
            this.changeStatus('online');
        },

        changeToOffline: function() {
            this.changeStatus('offline');
        },

        changeStatus: function(toStatus) {
            if (this.isProcessingStatus) return;

            var data = {
                    'sStatus': toStatus
                },
                settings = {
                    'context': this,
                    'beforeSend': this.beforeSend
                };

            utils.api.post('chat/changestatus', data, settings).done(this.postDone).always(this.postComplete);
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.isProcessingStatus = false;
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.isProcessingStatus = true;
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if (data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function(data) {
            this.model.set('sChatStatus', data['sStatus']);
            utils.modal.toast('Changed Status Successfully');
            // this.render();

        },

        unmuteNotification: function() {
            utils.observer.trigger('chat:turn-on-notification');
            this.render();
        },
        inject: function() {
            this.$el.attr({
                id: this.model.getDataId()
            });
            return this.constructor.__super__.inject.apply(this, arguments); // call parent inject
        },

    });
});