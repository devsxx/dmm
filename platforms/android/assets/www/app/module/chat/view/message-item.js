define([
	'text!chat/tpl/message-item.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'message-item',
		template: _.template(text),
        events: {
        },
        initialize: function() {
            this.model.on('change', function() {
                this.render();
            }, this);
        },

		render: function(){
            this.$el.html(this.template({
                item: this.model
            }));

            this.$el.attr({id: this.model.getDataId()});
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		},
	});
});

