define([
	'chat/model/message',
	'chat/view/message-item',
	'text!chat/tpl/message-list.html',
	'chat/collection/message',
],function(Model, ItemView, text){
    var Collection = require('chat/collection/message')

	return Backbone.ListViewCollection.extend({
		defaults: {
            iMessageAmount: 10 
		},
		followById: true,
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

