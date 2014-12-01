define([
    'text!forum/tpl/forum-poll-setting.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text),
        events: {
            'click': 'closeThis'
        },
        closeThis: function(evt) {
            utils.popup.close();
        }
    });
});