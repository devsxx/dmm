define([
	'text!event/tpl/event-item.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'event-item',
		template:  _.template(text),
		render: function(item){
			var context = {
				item: item,
				date: item.getDate()
			};
			
			this.$el.html(this.template(context));
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
