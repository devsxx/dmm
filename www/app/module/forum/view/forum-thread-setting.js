define([
    'text!forum/tpl/forum-thread-setting.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text)
    });
});