define([
	'text!quiz/tpl/quiz-setting.html'
],function(text){
	return Backbone.PopupView.extend({
		template: _.template(text)
	});
});
