define([
    'page/model/page'
], function(Model){

    return Backbone.Collection.extend({
        model: Model
    });
});
