define([
], function() {

    var Model = Backbone.Model.extend();

    Model.prototype.getSubscriptionPackages = function() {

        return this.get('aPackage') || [];
    }

    Model.prototype.subscribeIsRequiredOnSignUp = function() {

        return this.get('aPerm').bSubscribeIsRequiredOnSignUp || false;
    }



    return Model;
});
