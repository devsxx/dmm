define([
    'comet/model/message'
], function() { 
    var MessageModel = require('comet/model/message')

    var MessageCollection = Backbone.Collection.extend({
        model: MessageModel,
        comparator: 'iMessageId' // new aded message will be added ascendingly by id 
        // comparator: function(message) {
        //     console.log("ABC", message);
        //     return -message.get("iTimestamp"); // Note the minus!
        // }
    });
    
    return MessageCollection;
});


