define([
    'marketplace/model/listing'
], function(Model) {

    return Backbone.Collection.extend({
        model: Model
    });
});