define([
	'event/view/event-item',
	'text!event/tpl/event-detail-activity.html',
    'event/view/event-topmenu',
	'activity/view/activity-list',
	'activity/view/activity-minibar'
], function(ItemView, text, TopMenuView, ListView, MiniBarView){
	
	return ItemView.extend({
		region: {
			main: '#main',
			content: '#content'
		},
		template: _.template(text),
		className: 'newsfeed-page',
		topMenuView: TopMenuView,
		render: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			this.$el.attr({
				id: this.model.getDataId()
			});
			
			this.$topMenuBtn = this.$el.find('#top_menu_toggle');
			
			return this;
		},
		inject: function(){
			var self = this;
			
			$(this.region.main).html(this.$el);
			
			this.$scroller = this.$el.find('#content');
			
			this.$scroller.ensureVerticalScroll();
						
			utils.api.get('event/view', {iEventId: this.model.getId()}, {context: this})
			.done(function(data){
				if(data.error_code && data.error_code > 0){
	        		utils.modal.alert(data.error_message);
	        		utils.history.back();
	        	}else{
					this.model.set(data);
					this.updateView();
	        	}
			});
			
			// activity list
			new ListView({}, this.$el.find('#activity-list'), this.$scroller, {loadnew: true}).render({
				sItemType: 'event',
				sParentId: 'event',
				iItemId: this.model.getId()
			}).inject();
			
			return this;
		},
		events: {
            "click #top_menu_toggle": "toggleTopMenu"
		},
        toggleTopMenu: function () {
        	utils.topMenu.toggle(this, this.model);
            this.topMenuIsShown(false);
		},
		deleteSuccess: function (data) {
        	utils.modal.toast(data.message);
        	window.location.href= '#events/my';
        },
		updateView: function(){
			this.$topMenuBtn.removeClass('hide');
			
			// mini bar
			if (this.model.canComment()) {
				this.$scroller.addClass('with-topbar');
				
				new MiniBarView().render({
					sItemType: this.model.getType(),
					iItemId: this.model.getId(),
					exclude: ['checkin']
				}).inject();
			}
		}
	});
});
