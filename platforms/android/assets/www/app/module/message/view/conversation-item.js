define([
	'text!message/tpl/conversation-item.html'
],function(text){
	return Backbone.View.extend({
		region: {},
		className: 'conversation-item',
		template: _.template(text),
		render: function(){
			
			if (!this.model.isRead()) {
				this.$el.addClass("message-new");
			}
			
			this.$el.attr("id", "conversation_item_" + this.model.getId());
			
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
