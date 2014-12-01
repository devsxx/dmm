define([
	'text!event/tpl/event-topmenu.html',
],function(text){
	return Backbone.TopMenuView.extend({
		moduleId: 'event/view/event-topmenu',
		template: _.template(text),
        inject: function(){
			utils.popup.open(this.$el);
			return this;
		},
		hide: function(){
            utils.popup.close();
			return this;
		}
	});
});