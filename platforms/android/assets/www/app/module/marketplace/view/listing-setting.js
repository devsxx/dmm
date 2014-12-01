define([
    'text!marketplace/tpl/listing-setting.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text)
    });
});