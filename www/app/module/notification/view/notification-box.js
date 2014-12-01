define([
	'core',
    'core/plugin/updater',
	'text!notification/tpl/notification-box.html',
	'notification/view/notification-box-list'
],function(core, updater, text, ListView){
	
	return Backbone.View.extend({
		region: {
			wrapper: '#box-notification',
			indicator: '#beeber-notification-indicator',
			listViewHolder: '#notification_box_list_view_holder',
			scroller: '#box-notification-content'
		},
		events: {
			"click #mark_read_all_btn": "markReadAll"
		},
		markReadAll: function () {
			var self = this;
	        
	        utils.api.post("notification/markreadall")
	        .done(function (data) {
	        	updater.setNumberNewNotification(0);
                self.close();
	        });
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