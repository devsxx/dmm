define([
    'chat/model/chat'
], function() { 
    var ChatModel = require('chat/model/chat')

    var ChatCollection = Backbone.Collection.extend({
        model: ChatModel,
        // comparator: function(item) {
        //     return -item.getLastMessageTimestamp();
        // },
        comparator: function(first, second) {
            var rs

            rs = this.compareLastTimestamp(first, second);
            if(rs !== 0) return rs;

            rs = this.compareStatus(first, second);
            if(rs !== 0) return rs;

            rs = this.compareName(first, second);
            if(rs !== 0) return rs;

            return 0;

        },
        compareLastTimestamp: function(first, second) {
            if(first.getLastMessageTimestamp() > second.getLastMessageTimestamp()) {
                return -1;
            } else {
                if(first.getLastMessageTimestamp() == second.getLastMessageTimestamp()) {
                    return 0;
                } else {
                    return 1;
                }
            }
        },

        compareStatus: function(first, second) {
            if(first.getStatus() !== second.getStatus()){
                if(first.getStatus() == 'online') {
                    return -1;
                }

                if(second.getStatus() == 'online') {
                    return 1;
                }
            }  

            return 0;
        },

        compareName: function(first, second) {
            if(first.getName() > second.getName()) {
                return 1;
            } else {
                return -1;
            }

        },
        isStillUpdate: false,

        clearCurrent: function() {
            _.each(this.models, function(chat) {
                chat.set('bIsCurrent', false, {
                    silent: true
                });
            }, this);
        }
    });

    return ChatCollection;
});

