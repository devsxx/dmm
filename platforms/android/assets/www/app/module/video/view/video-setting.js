define([
	'text!video/tpl/video-setting.html'
], function(text){
	return Backbone.PopupView.extend({
		template: _.template(text)
	});
});
