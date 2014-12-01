define([
	'text!link/tpl/attachment-link.html'
],function(text){
	
	return Backbone.View.extend({
		region: {},
		className: 'attachment-link',
		template: _.template(text),
		render: function(){
			
			var item = this.model;
			var att = item.getAttachments()[0];
			
			var context = {
				item: item,
				attachment: att,
				domain: '', // etc: tuoitre.vn
				onclick: ["'"+att.sOriginalLink_Url+"'", "'_blank'","'location=yes'"].join(',')
			};
			
			this.$el.html(this.template(context));
			
			return this;
		},
		inject: function(dom){
			dom.html(this.el);
		}
	});
});
