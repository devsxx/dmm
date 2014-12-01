define([
	'chat/model/chat',
	'chat/view/chat-item',
	'text!chat/tpl/chat-list.html',
	'chat/collection/chat',
    'core'
],function(Model, ItemView, text){
    var ChatCollection = require('chat/collection/chat')
      , timestampKey = 'chat-last-ping-timestamp'
      , core = require('core')

	return Backbone.ListViewCollection.extend({
		defaults: {
			sAction: "all",
		},
		followById: false,
		api: 'chat/getchatlist',
		phraseNotFound: 'No friends availabe for chatting.',
		phraseNotMore: 'No more friends.',
		className: 'chat-friend-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView,
        pingStack: [],
        iLastTimestamp: localStorage.getItem(timestampKey), // to get no new message
        iGetNewMessages: 1,
        Collection: ChatCollection,
        handleCollectionReset: function(col, options) { // to preseve message list after chat list retrieved 

            _.each(options.previousModels, function(previous) { 
                var current = this.collection.get(previous.getId());
                current.set('messages', previous.getMessages());
                current.set('bIsCurrent', previous.isCurrent());
            }, this);
            this.rerenderView();
        },

        init: function() {
            this.constructor.__super__.init.apply(this, arguments); // call parent inject
            this.collection.on('all', function() {
                utils.observer.trigger('chat:update-notification', this.collection);
            }, this);
        },

        startChatlistUpdater: function() {
            this.setupUpdater();
            return this;
        },
        
        setupUpdater: function() {
            var that = this;

            setTimeout(function() {
                that.update();
            }, 30 * 1e3);

            return this;
        },

        update: function() {
            this.isFirst = true; //to refresh the list
            this.loadMore();
            if(this.isStillInChatListView()) {
                this.setupUpdater();
            }  else {
                this.$ajaxMore.abort();
            }
        },

        isStillInChatListView: function() {
            return $('.chat-friend-list').length == 0 ? false : true;
        },

        startPing: function() {
            if(this.collection.isStillUpdate ) return ;
            this.setupPing();
            this.isStillUpdate = true;
            return this;
        },
        
        setupPing: function() {
            var that = this
              , pingInterval;

            that.pingStack.push(that.ping);

            pingInterval = setInterval(function() {

                if(!that.isStillInChatListView() && core.viewer.isMuteChatNotification()) {
                    window.clearInterval(pingInterval);
                    that.collection.isStillUpdate = false;
                    return ;
                }

                var toExecute = that.pingStack.pop();
                if(toExecute) {
                    toExecute.apply(that);
                }

            }, 5 * 1e3);

            return this;
        },

        ping: function() {
            var data = {
                iGetNewMessages: this.iGetNewMessages
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            if(this.iLastTimestamp) {
                data.iLastTimeStamp = this.iLastTimestamp;
            }

            utils.api.post('chat/ping', data, settings).done(this.postDone).always(this.postComplete);

        },
        
        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.pingStack.push(this.ping);
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
            this.iLastTimestamp = data.iLastTimeStamp;
            localStorage.setItem(timestampKey, data.iLastTimeStamp);
            if(data.aNewMessages) {
                _.each(data.aNewMessages, function(message) {
                    message.bNeedToScroll = true;
                    var chat = this.collection.findWhere({
                        'iItemId': message.iSenderId
                    });

                    if(chat) {
                        var messageModel = chat.getMessages().add(message);
                        chat.getMessages().trigger('new-message-appended-success', messageModel);
                        if(!chat.isCurrent()) {
                            chat.trigger('add-new-unread-message', messageModel);
                        }
                    }
                }, this);
            }
            // this.collection.add(data.aNewMessages);
        },

        // parseData: function(data) {
        //     return data;
        // }

	});
});
