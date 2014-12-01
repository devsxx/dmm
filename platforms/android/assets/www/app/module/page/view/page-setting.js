define([
    'text!page/tpl/page-setting.html'
],function(text){
    return Backbone.PopupView.extend({
        template: _.template(text)
    });
});

