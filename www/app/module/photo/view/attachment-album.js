define([
	'text!photo/tpl/attachment-album.html'
],function(){
	
	return Backbone.View.extend({
		region: {},
		render: function(item){
			this.$el.html('text translate albums');
			return this;
		},
		inject: function(dom){
			dom.html(this.el);
			return this;
		}
	});
});
