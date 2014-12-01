define([
	'text!event/tpl/event-guest-item.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'event-guest-item',
		template: _.template(text),
		render: function(item){
			
			this.$el.html(this.template({item: item}));
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
