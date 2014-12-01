define([
	'core',
	'text!message/tpl/message-box.html',
	'message/view/message-box-list'
],function(core, text, ListView){
	
	return Backbone.View.extend({
		region: {
			wrapper: '#box-message',
			indicator: '#beeber-message-indicator',
			scroller: '#box-message-content',
			listViewHolder: '#message_box_list_view_holder',
			scroller: '#box-message-content',
		},
		events: {
			'click .box-footer': 'viewAll'
		},
		template: _.template(text),
		viewAll: function()
		{
			utils.observer.trigger('router:changed');
			
			window.location.href = '#messages';
			
		},
		render: function(){
			this.$el.html(this.template());
			
			this.$scroller = this.$el.find(this.region.scroller);
			this.$listViewHolder = this.$el.find(this.region.listViewHolder);
			
			this.$wrapper = $(this.region.wrapper);
			this.$indicator = $(this.region.indicator);
			
			return this;
		},
		inject: function(){
			
			this.$wrapper.html(this.$el);
			
			var useSwiper   =  constants.os_version < '30';
			this.$scroller.ensureVerticalScroll(useSwiper);
			
			this.listView = new ListView({},
				this.$listViewHolder,
				this.$scroller,
				{loadnew: false, loadmore: true});
			
			this.listView.render(this.query).inject();
				
			return this;
		},
		open: function(){
			
			this.$wrapper.addClass('open');
			
			this.$indicator.find('.beeber-counter').addClass('hide');

			this.$indicator.addClass('active');
			
			core.updater.setNumberNewMessage(0);
			
			return this;
		},
		close: function(){
			var that = this;

			this.$wrapper.removeClass('open');
						
			this.$indicator.removeClass('active');
			
			window.setTimeout(function(){
				that.remove();
			},300);
			
			return this;
		}
	});
});