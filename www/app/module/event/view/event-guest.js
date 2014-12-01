define([
	'text!event/tpl/event-guest.html',
	'event/view/event-guest-list',
	'user/model/user'
], function(text, ListView, UserModel){
	
	return Backbone.View.extend({
		region: {
			main: '#simple-popup',
            content: '#popup-content'
		},
        
        template: _.template(text),
        
        render: function(context){
        	
        	this.context = $.extend({}, context);
        	
        	this.$el.html(this.template(this.context));

			this.$scroller = this.$el.find(this.region.scroller);
			
			return this;
		},
		
        inject: function(){
			var main = $(this.region.main);
			
			main.html(this.el);
			
			var content = $(this.region.content);
			
			content.vscroll();
			
			// get user list
			this.appendList();
			
			utils.popup.open(this.$el);

			if(constants.os_version < '30'){
				this.$scroller.ensureSwiper();
			}
			
			return this;
		},
		
		appendList: function () {
			var self = this;
            
            var sendData = {
                iEventId: this.context.iEventId,
	            iRSVP: this.context.iRSVP,
	            iAmountOfMember: 9999
            };
            
            utils.api.get('event/viewguestlist', sendData)
			.done(function(data){
				if (data.error_code && data.error_code > 0) {
					return utils.modal.alert(data.error_message || _t('Can not load data from server'));
				}
				
				var items = data.map(function(item){
					return new UserModel(item);
				});
				
				new ListView().render({
					items: items
				}).inject();
			});
		}
	});
});
