define([
    'text!comet/tpl/chat-setting.html',
], function(text) { 
    return Backbone.PopupView.extend({
        template: _.template(text),
        events: {
            'muteNotification': 'muteNotification',
            'unmuteNotification': 'unmuteNotification',
            'toAway': 'changeToAway',
            'toAvailable': 'changeToAvailable',
            'toOffline': 'changeToOffline',
            'toInvisible': 'changeToInvisible',
            'toBusy': 'changeToBusy'
            // 'available','away','busy','invisible','offline'
        },
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        
        //'available','away','busy','invisible','offline'
		
		changeToAway: function() {
            this.changeStatus('away');
        },
        
        changeToAvailable: function() {
            this.changeStatus('available');
        },
        changeToOffline: function() {
            this.changeStatus('offline');
        },
		changeToInvisible: function() {
            this.changeStatus('invisible');
        },
        changeToBusy: function() {
            this.changeStatus('busy');
        },
        changeStatus: function(toStatus) {
            if(this.isProcessingStatus) return ;
            
            localStorage.setItem('cometchat_status',toStatus)
        	
        	var data = {
                'sStatus': toStatus
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.cometPost('chat/changestatus', data, settings).done(this.postDone).always(this.postComplete);
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
            this.model.set('sChatStatus', data['sStatus']);
            utils.modal.toast('Changed Status Successfully');
            // this.render();
            utils.popup.close();

        },
        muteNotification: function() {
            utils.observer.trigger('comet:turn-off-notification');
            utils.popup.close();
        },
        unmuteNotification: function() {
            utils.observer.trigger('comet:turn-on-notification');
            $('#chat-friend-list').trigger('setupPing');
            // this.render();
            utils.popup.close();
        },
        inject: function() {
            this.$el.attr({id: this.model.getDataId()});
            return this.constructor.__super__.inject.apply(this, arguments); // call parent inject
        },
    });
});

