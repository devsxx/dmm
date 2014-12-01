define([
    'chat/model/message'
], function() { 
    var MessageModel = require('chat/model/message')

    var MessageCollection = Backbone.Collection.extend({
        model: MessageModel,
//        comparator: 'iMessageId' // new aded message will be added ascendingly by id 
        comparator: function (message) {
            return parseInt(message.get('iMessageId'));
        }
    });


    return MessageCollection;
});


