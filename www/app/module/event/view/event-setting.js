define([
	'text!event/tpl/event-setting.html'
],function(text){
	return Backbone.PopupView.extend({
		template: _.template(text)
	});
});
