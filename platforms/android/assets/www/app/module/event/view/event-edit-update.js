define([
	'text!event/tpl/event-edit-update.html'
], function (text) {
	return Backbone.View.extend({
		region: {
			main: '#event-edit',
			content: '#content'
		},
		className: 'event-add-form',
		template: _.template(text),
		render: function(context){
			
			this.context = $.extend({}, context);
			
			this.$el.html(this.template(this.context));
			
			return this;
		},
		inject: function(){
			
			var main = $(this.region.main);
			
			main.html(this.el);
			
			var content = $(this.region.content);
			
			content.trigger('refresh');
		}
	});
});
