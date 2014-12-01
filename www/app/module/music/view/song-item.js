define([
	'text!music/tpl/song-item.html'
],function(text){
	
	return Backbone.ItemView.extend({
		className: 'music-song-item',
		template: _.template(text),
		events: {},
		render: function(){
			
            var sView = 'all';
            if(document.URL.match(/my/)) {
                sView = 'my';
            }
			this.$el.html(this.template({
                item: this.model,
                sView: sView
            }));
			
			this.$el.attr({
				'id': this.model.getDataId(),
				'rel': 'link',
				'data-url': this.model.getUrl(),
			});
			
			return this;
		},
		inject: function(inject){
			inject(this.$el);
		}
	});
});
