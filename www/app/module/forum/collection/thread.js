define([
    'forum/model/thread'
], function(Model) {
    return Backbone.Collection.extend({
        model: Model
    });
});