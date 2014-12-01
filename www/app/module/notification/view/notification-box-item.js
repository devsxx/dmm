define([
	'text!notification/tpl/notification-box-item.html'
],function(text){

	return Backbone.View.extend({
		region: {},
		className: 'box-notification-item',
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		inject: function(inject){
			inject(this.$el);
		},
		events: {
			"click a": "makeRead"
		},
		makeRead: function (evt) {
	        var self = this;
	        
	        var sendData = {
	        	"iNotificationId": this.model.getId()
	        }
	        
	        utils.api.post("notification/makeread", sendData)
	        .done(function (data) {
	        	if (data.hasOwnProperty('error_code') && data.error_code) {
	        		utils.modal.alert(data.error_message);
	        		return;
	        	}
	        	self.$el.remove();
	        });
	    },
	});
});
