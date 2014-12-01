define([
    'blog/model/blog'
], function (Model) {

    return Backbone.Collection.extend({
        model: Model
    });
});