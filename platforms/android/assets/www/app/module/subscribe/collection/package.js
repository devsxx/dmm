define([
    'subscribe/model/package'
],function(Model){

    return Backbone.Collection.extend({
        model: Model
    });
});
