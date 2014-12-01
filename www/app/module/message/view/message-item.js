define([
	'text!message/tpl/message-item.html',
	'message/view/message-item-attachment'
],function(text, AttachmentView){
	
	return Backbone.View.extend({
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			if (this.model.get('aAttachments') != "") {
				var attachmentHolder = this.$el.find('.item-attachment');
				attachmentHolder.html(new AttachmentView().render(this.model.get('aAttachments')).el);
			}
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
