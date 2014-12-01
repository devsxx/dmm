define([
    'poll/model/poll'
], function (Model) {

    return Backbone.Collection.extend({
        model: Model
    });
});