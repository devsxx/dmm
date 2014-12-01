define([
	'text!photo/tpl/attachment-album-photo-item.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		//className: 'attachment-album-photo-item',
		template: _.template(text),
		render: function(item){
			// this.$el.attr("id","album_id_"+item.PhotoId);
			this.$el.html(this.template({item: item}));
			return this;
		},
		inject: function(inject){
			inject(this.el);
		}
	});
});
