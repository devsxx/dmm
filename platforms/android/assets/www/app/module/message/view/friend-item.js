define([
	'text!message/tpl/friend-item.html'
], function(text) {

	return Backbone.View.extend({
		region : {},
        tagName: 'li',
		className : 'friend-item',
		template : _.template(text),
		render : function() {
        
            this.$el.attr({
                'data-id': this.model.getId(),
                'data-title': this.model.getTitle()
            });

			this.$el.html(this.template({
				item : this.model
			}));

			return this;
		},
		inject : function(inject) {
			inject(this.$el);
		}
	});
});
