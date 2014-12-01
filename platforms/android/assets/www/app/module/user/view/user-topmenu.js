define([
	'text!user/tpl/user-topmenu.html'
], function(text){
	return Backbone.TopMenuView.extend({
		template: _.template(text),
	});
});
