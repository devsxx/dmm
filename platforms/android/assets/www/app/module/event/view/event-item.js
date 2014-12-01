define([
	'text!event/tpl/event-item.html',
	'event/view/event-setting',
    'event/view/event-rsvp',
    'event/view/event-guest',
    'event/ipad/view/event-item'
],function(text, SettingView, RSVPView, GuestView){
	
	return Backbone.ItemView.extend({
		moduleId: 'event/view/event-item',
		region: {
			main: '#main',
			content: '#content'
		},
		className: 'event-item',
		template:  _.template(text),
		settingView: SettingView,
		events: {
			"click #top_menu_toggle": "toggleTopMenu",
			"click #rsvp_btn": "onRSVPClick",
	        "click .guest-count": "showMemberList",
            "rsvp": "postRSVP"
		},
		initialize: function(){
			var self = this;
			this.model.on('change',function(){
				self.updateNumberOfMemberCount();
			});
			Backbone.ItemView.prototype.initialize.apply(this, arguments);
		},
		render: function(){
			
			this.$el.html(this.template({item: this.model, date: this.model.getDate()}));
			
			this.$el.attr({
				'id': this.model.getDataId(),
				'rel': 'link',
				'data-url': this.model.getUrl(),
			});
			
			this.$rsvpBtn = this.$el.find('#rsvp_btn');
			this.$rsvpHolder = this.$el.find('.event-rsvp-dropdown-wrapper');
			
			return this;
		},
		inject: function(inject){
			inject(this.$el);
			
			return this;
		},
		onRSVPClick: function () {
			if (this.$rsvpBtn.isProcessing()) {
				return false;
			}
			
			if(this.$rsvpBtn.hasClass('active')){
				this.$rsvpBtn.removeClass('active');
				this.$rsvpHolder.addClass('hide');
			}else{
				this.$rsvpBtn.addClass('active');
				
				new RSVPView({
	            	model: this.model
	            }, this.$rsvpHolder)
	            .render()
	            .inject();
			}
		},
        
        postRSVP: function (evt, data) {
            var postData = {
                iEventId: this.model.getId(),
                iRsvp: data.rsvp
            };
            
            this.$rsvpHolder.addClass('hide');
            this.$rsvpBtn.removeClass('active');
            
            utils.popup.close();
            
            this.$rsvpBtn.addClass('processing');
            
            utils.api.post('event/addrsvp', postData, {context: this})
            .done(this.postRSVPComplete)
            .fail(this.postRSVPFail);
        },
        
        postRSVPComplete: function(data){
        	
        	this.$rsvpBtn.isProcessing(false)
        	
            if (null != data.error_code && 0 != data.error_code) {
                utils.modal.alert(data.error_message);
                return;
            }else{
                // success
                utils.modal.toast(data.message);
                if(data.event_data){
                	this.model.set(data.event_data);
                }
            }
        },

        postRSVPFail: function(){
        	this.$rsvpBtn.isProcessing(false)
        },

        updateNumberOfMemberCount: function (api) {
        	this.$el.find('.text-total-member').text(this.model.getTextTotalMember());
        },
        
        doDeleteConfirm: function () {
            var self = this;
            utils.modal.confirm("Do you want to delete this event?", function (selected) {
                if (selected == 1) {
                    utils.observer.trigger('blockui');
                    
                    utils.api.post("event/delete", {iEventId: self.model.getId()})
                    .always(function () {
		                utils.observer.trigger('releaseui');
		                utils.popup.close();
		            })
                    .done(function(data){
                        if (data.error_code && data.error_code > 0) {
							return utils.modal.alert(data.error_message || _t('Can not load data from server'));
						}
                        
                        // success
                        self.deleteSuccess(data);
                    });
                }
            }, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
        },
        
        deleteSuccess: function (data) {
        	utils.modal.toast(data.message);
            this.$el.remove();
            
            var content = $(this.region.content);
            content.trigger('refresh');
        },
        
        showMemberList: function (evt) {
        	new GuestView().render({
        		iEventId: this.model.getId(),
        		iRSVP: $(evt.currentTarget).data('rsvp')
        	}).inject();
        }
	});
});
