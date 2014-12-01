define([
	'event/view/event-item',
	'text!event/tpl/event-detail-photo.html',
    'event/view/event-topmenu',
	'photo/view/photo-list'
], function(ItemView, text, TopMenuView, ListView){
	
	return ItemView.extend({
		region: {
			wrapper: '#main',
			scroller: '#content',
			listViewHolder: '#photo-list',
			topMenu: '#top_menu_toggle'
		},
		topMenuView: TopMenuView,
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			this.$scroller = this.$el.find(this.region.scroller);
			this.$listViewHolder  = this.$el.find(this.region.listViewHolder);
			this.$topMenu  = this.$el.find('#top_menu_toggle');
			
			this.$el.attr({
				id: this.model.getDataId()
			});
			
			return this;
		},
		inject: function(){
			
			$(this.region.wrapper).html(this.$el);
			
			this.$scroller.ensureVerticalScroll();
			
			this.fetchData();
			
			this.listView = new ListView({}, 
				this.$listViewHolder,
				this.$scroller, 
                {iParentId: this.model.getId()}
			);
			this.listView.render({
				sItemType: this.model.getType(),
				iItemId: this.model.getId()
			}).inject();
			
			return this;
		},
		fetchData: function(){
			var sendData  = {iEventId: this.model.getId()},
				settings  = {context: this}
				;
				
			utils.api.get('event/view', sendData, settings)
			.done(this.fetchDataComplete)
			.fail(this.fetchDataFail);
		},
		fetchDataComplete: function(data){
			if(data.error_code && data.error_code > 0){
				utils.modal.alert(data.error_message);
			}else{
				this.model.set(data);
				this.updateView();
			}
		},
		updateView: function(){
			this.$topMenu.removeClass('hide');
		},
		fetchDataFail: function(){
			utils.modal.alert(_t('Could not get data from server'));
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
        }
	});
	
});
