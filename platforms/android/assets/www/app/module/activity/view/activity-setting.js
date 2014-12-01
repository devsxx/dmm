define([
	'text!activity/tpl/activity-setting.html'
],function(text){
	return Backbone.PopupView.extend({
        template: _.template(text)
    });
});
