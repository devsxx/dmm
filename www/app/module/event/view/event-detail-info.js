define([
	'text!event/tpl/event-detail-info.html',
	'text!event/tpl/event-detail-info-update.html',
	'event/view/event-item',
    'event/view/event-topmenu',
    'event/ipad/view/event-detail-info'
], function(){
	
	var text		= require('text!event/tpl/event-detail-info.html')
	  , ItemView	= require('event/view/event-item')
	  , textInfoUpdate =  require('text!event/tpl/event-detail-info-update.html')
	  , RSVPView	= require('event/view/event-rsvp');
	
	return ItemView.extend({
		moduleId: 'event/view/event-detail-info',
		region: {
			holder: '#main',
			scroller: '#content',
		},
		className:'event-detail-page',
		template: _.template(text),
		topMenuView: require('event/view/event-topmenu'),
		templateInfoUpdate: _.template(textInfoUpdate),
		render: function(){

			this.$el.attr('id', this.model.getDataId());
			
			this.$el.html(this.template({item: this.model}));
			
			this.$holder =  $(this.region.holder);
			
			this.$scroller =  this.$el.find('#content');
			
			this.$titleLabel  = this.$el.find('#page_title');
			
			this.$eventDetailInfoHolder =  this.$el.find('#event-detail-info');
			
			this.$topMenuBtn = this.$el.find('#top_menu_toggle');
			
			return this;
		},
		
		inject: function(){
			var self = this;
			
			this.$holder.html(this.$el);
			
			this.$scroller.ensureVerticalScroll();			
			
			
			this.fetchData();
			
			return this;
		},
		
		updateNumberOfMemberCount: function (api) {
			
        	this.updateView();
        },
        
        fetchData: function(){
        	
        	var sendData  = {iEventId: this.model.getId()},
        		settings  = {context: this}
        		;
        	
			utils.api.get('event/detail', sendData, settings)
			.done(this.fetchDataComplete)
			.fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data){
        	
        	if(data.error_code && data.error_code > 0){
        		utils.modal.alert(data.error_message);
        		utils.history.back();
        	}else{
				this.model.set(data);
				this.updateView();
        	}
        	// besure about error code
        },
        
        fetchDataFail: function(){
        	
        },
        
        toggleTopMenu: function () {
			utils.topMenu.toggle(this, this.model);
            this.topMenuIsShown(false);
		},
		
		updateView: function () {
			// don't have view permission
			if (!this.model.canView()) {
				this.$titleLabel.html(_t('Private Page'));
				this.$eventDetailInfoHolder.html(utils.helper.permission_deny());
				return;
			}
            
            this.$topMenuBtn.removeClass('hide');
			$('#event_menu_actvity').removeClass('hide');
            $('#event_menu_photo').removeClass('hide');
			
			this.$titleLabel.html(this.model.getTitle());
			
			this.$eventDetailInfoHolder.html(this.templateInfoUpdate({
				item: this.model,
				date: this.model.getDate(),
                end_date: this.model.getDate(true)}));
            
            this.$rsvpBtn = this.$el.find('#rsvp_btn');
			
			this.$rsvpHolder = this.$el.find('.event-rsvp-dropdown-wrapper');
			
            this.$scroller.trigger('refresh'); // refresh view.
		},
        deleteSuccess: function (data) {
        	utils.modal.toast(data.message);
        	window.location.href= '#events/my';
        }
	});
});
