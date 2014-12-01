define([
	'text!chat/tpl/chat-item.html',
	'chat/view/chat-detail'
],function(text){
    var ChatDetailView = require('chat/view/chat-detail')
	
	return Backbone.ItemView.extend({
		className: 'friend-item',
        detailView: ChatDetailView,
		template: _.template(text),
        initialize: function() {
            this.constructor.__super__.initialize.apply(this, arguments); // call parent inject
            this.model.on('change', this.render, this);
        },
		render: function(){
			
			this.context = {item: this.model};
            
            this.$el.html(this.template(this.context));
            if(this.model.hasNewMessage()) {
                this.$el.addClass('has-new-message');
            } else {
                this.$el.removeClass('has-new-message');
            }

            if(this.model.isCurrent()) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }

            this.$el.attr({id: this.model.getDataId()});
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
            return this;
		},
	});
});
