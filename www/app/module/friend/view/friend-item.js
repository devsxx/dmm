define([
	'text!friend/tpl/friend-item.html'
], function(text) {

	return Backbone.View.extend({
		region : {},
		className : 'friend-item',
		template : _.template(text),
		render : function() {

			this.$el.html(this.template({
				item : this.model
			}));

			return this;
		},
		inject : function(inject) {
			inject(this.$el);
		},
		events : {
			"click #add_friend_btn" : "addFriend"
		},
		addFriend : function(evt) {

			var target = $(evt.currentTarget);

			if (target.hasClass("processing")) {
				return;
			}

			target.addClass("processing");

			var sendData = {
				iUserId : this.model.getId()
			}, settings = {
				context : this
			};

			utils.api.post("friend/add", sendData, settings)
			.always(function() {
				target.removeClass("processing");
			}).done(function(data) {
				if (data.hasOwnProperty('error_code') && data.error_code) {
					utils.modal.alert(data.error_message);
					return;
				}
				target.parent().html('<div class="request-sent">Request sent</div>');
			});
		}
	});
});
