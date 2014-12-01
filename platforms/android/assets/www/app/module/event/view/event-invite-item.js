define([
	'text!event/tpl/event-invite-item.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'event-invite-item',
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
