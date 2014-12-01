define([
    'text!photo/tpl/photo-more-menu.html'
], function(text) {
    return Backbone.PopupView.extend({
        template: _.template(text),
        events: {
            'touchend a': 'hideMenu'
        },
        hideMenu: function (evt) {
            if (utils.popup.isShown()) {
                utils.popup.close();
            }
        }
    });
});
