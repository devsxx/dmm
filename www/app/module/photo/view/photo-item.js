define([
	'text!photo/tpl/photo-item.html',
    'photo/ipad/view/photo-item'
],function(text){
	return Backbone.ItemView.extend({
		events: {},
		className: 'photo-item',
        moduleId: 'photo/view/photo-item',
		template: _.template(text),
		render: function(){
			this.$el.attr('id',this.model.getDataId());
            this.$el.html(this.template({item: this.model}));
			return this;
		},
		inject: function(inject){
			inject(this.el);
		},
	});
});
