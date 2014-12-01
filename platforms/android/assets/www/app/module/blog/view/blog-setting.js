define([
	'text!blog/tpl/blog-setting.html'
],function(text){
	return Backbone.PopupView.extend({
		template: _.template(text)
	});
});
