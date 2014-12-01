define([
	'comet/model/message',
	'comet/view/message-item',
	'text!comet/tpl/message-list.html',
	'comet/collection/message',
],function(Model, ItemView, text){
    var Collection = require('comet/collection/message')

	return Backbone.ListViewCollection.extend({
		defaults: {
            iMessageAmount: 50 
		},
		followById: true,
		apiFn: utils.api.cometPost,
		api: 'chat/getmessages',
		phraseNotFound: 'No message.',
		phraseNotMore: 'No more message.',
		className: 'chat-message-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView,
        nearMessagePeriod: 3, // in minute
        Collection: Collection,
        init: function() {
            this.constructor.__super__.init.apply(this, arguments); // call parent inject
            this.collection.on('new-message-appended-success', function(newMessage) {
                
                var indexOfNewMessage = this.collection.indexOf(newMessage);
                var lastMessage = this.collection.at(indexOfNewMessage - 1);
                if(!lastMessage) return;
                if(lastMessage.getSenderId() == newMessage.getSenderId()) {
                    $('#' + newMessage.getDataId()).hide();
                    var lastMessageContent = lastMessage.getMessages();
                    if(newMessage.getTimestamp() - lastMessage.getRecentUpdatedTimestamp() < this.nearMessagePeriod * 60) {
                        _.last(lastMessageContent).push(newMessage.getSMessage());
                    } else {
                        lastMessageContent.push([newMessage.getSMessage()]);
                    }
                    lastMessage.set({
                        'aMessages': lastMessageContent,
                        'iRecentUpdatedTimestamp': newMessage.getTimestamp()
                    });
                    lastMessage.trigger('change');
                    this.collection.remove(newMessage);

                }

                // this.newMessage.clear();
            }, this);

            if(constants.platform == 'android') {
                this.on('view:load-complete', function() {
                    // setTimeout(function() {
                        $('body').scrollTop(9999999);
                    // }, 200);

                }, this);
            }
        },
		loadNew: function(){
            this.isFirst = false;
            this.loadMore();
		},

        updateQuery: function() {
            if(this.collection.length > 0) {
                this.query.iMaxId = this.collection.first().getId();
            } else {
                this.query.iMaxId = 99999999;
            }
        },
        parseData: function(data) {
            var parsedData = []
              , currentId = -1 
              , accumulateItem = { } 
              , iLastTimestamp = 0
              , aMessageContent = []

            _.each(data, function(message) {

                if(currentId == message.iSenderId) {
                    if(Math.abs(iLastTimestamp - message.iTimestamp) <= this.nearMessagePeriod * 60) { // under 3 minutes
                        _.last(aMessageContent).push(message.sMessage);
                    } else {
                        aMessageContent.push([message.sMessage]);
                    }
                    accumulateItem.iRecentUpdatedTimestamp = message.iTimestamp;
                } else {
                    aMessageContent = [[message.sMessage]]; //message is array of array

                    accumulateItem = message;

                    accumulateItem.aMessages = aMessageContent

                    parsedData.push(accumulateItem);
                }

                currentId = message.iSenderId;
                iLastTimestamp = message.iTimestamp;

            }, this);

            // var parsedData = _.sortBy(parsedData, function(message) {
            //     return -message.iTimestamp;
            // }); // sort by time stamp decendingly to move lastesst item first why appening
            return parsedData;

            // return this.constructor.__super__.parseData.apply(this, [parsedData]);


        }
	});
});

