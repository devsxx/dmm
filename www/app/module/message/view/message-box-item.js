define([
	'text!message/tpl/message-box-item.html'
],function(text){

	return Backbone.View.extend({
		className: 'box-message-item',
		template: _.template(text),
		render: function(){
			if (!this.model.isRead()) {
				this.$el.addClass("message-new");
			}
			this.$el.attr("id", "message_item_" + this.model.getId());
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
