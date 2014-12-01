define([
	'event/view/event-guest-item'
], function (ItemView) {
	return Backbone.View.extend({
		region: {
			content: '#popup-content',
			list: '#event-guest-list'
		},
		template: null,
		render: function(context){
			
			this.context = $.extend({}, context);

			this.$scroller = this.$el.find(this.region.scroller);
			
			return this;
		},
		inject: function(){
			
			var content = $(this.region.content);
			var list = $(this.region.list);
			
			content.find('.loading-initiator').remove();
			
			if (this.context.items.length > 0) {
				function inject(dom) {
	                list['append'](dom);
	            }
				
				_.each(this.context.items, function (item) {
					new ItemView().render(item).inject(inject);
				});
			} else {
				$('#not_found').removeClass("hide");
			}
			
			if(constants.os_version < '30'){
				var that = this;
				window.setTimeout(function(){
					that.$scroller.trigger('refresh');
				},1000);
			}

		}
	});
});
