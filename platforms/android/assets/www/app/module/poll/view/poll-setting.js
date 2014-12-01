define([
	'text!poll/tpl/poll-setting.html'
],function(text){
	return Backbone.PopupView.extend({
		template: _.template(text)
	});
});
