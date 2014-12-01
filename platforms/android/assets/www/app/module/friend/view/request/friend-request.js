define([
	'text!friend/tpl/request/friend-request.html'
],function(text){
	
	return Backbone.View.extend({
		className: 'beeber-request-item',
		template: _.template(text),
		render: function(){
			this.$el.attr("id", "request_item_" + this.model.getPosterId());
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		inject: function(inject){
			inject(this.$el);
		},
		events: {
			"click #friend_accept_btn": "acceptFriend",
			"click #friend_deny_btn": "denyFriend"
		},
		acceptFriend: function (evt) {
			var self = this;
			var target = $(evt.currentTarget);
			
			if (this.isProcessing()) {
				return;
			}
			
			target.addClass("processing");
			
			var sendData = {
				iUserId: this.model.getPosterId()
			};
			
			utils.api.post("friend/confirm", sendData)
			.complete(function () {
				target.removeClass("processing");
			})
			.done(function (data) {
				if (data.hasOwnProperty('error_code') && data.error_code) {
					utils.modal.alert(data.error_message);
					return;
				}
				
				// response success
				target.parent().html('<div class="friend-confirmed">Confirmed</div>');
			});
		},
		denyFriend: function (evt) {
			var self = this;
			var target = $(evt.currentTarget);
			
			if (this.isProcessing()) {
				return;
			}
			
			target.addClass("processing");
			
			var sendData = {
				iUserId: this.model.getPosterId()
			};
			
			utils.api.post("friend/deny", sendData)
			.complete(function () {
				target.removeClass("processing");
			})
			.done(function (data) {
				if (data.hasOwnProperty('error_code') && data.error_code) {
					utils.modal.alert(data.error_message);
					return;
				}
				
				// response success
				target.parent().html('<div class="friend-denied">Denied</div>');
			});
		},
		isProcessing: function () {
			if ($('#friend_accept_btn').hasClass("processing")) {
				return true;
			}
			
			if ($('#friend_deny_btn').hasClass("processing")) {
				return true;
			}
			
			return false;
		}
	});
});
