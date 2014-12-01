define(function(){
	Backbone.PopupView = Backbone.View.extend({
        template: null, // need to be over write
        render: function(){
			this.$el.html(this.template({item: this.model}));
			return this;
		},
        inject: function(){
			
			utils.popup.open(this.$el);
			
			return this;
		}
	});
});
