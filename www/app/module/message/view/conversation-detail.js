define([
	'core',
	'text!message/tpl/conversation-detail.html',
	'message/model/conversation',
	'message/view/message-list'
], function(core, text, Model, ListView) {
	
	return Backbone.View.extend({
		region: {
			main: '#main',
			content: '#content'
		},
		template : _.template(text),
		events : {
			"click #toggle_recipients" : "toggleRecipients",
			"click #conversation_delete_btn": "deleteConversation"
		},
		render: function() {
			
            this.context = {
                item: this.model,
                viewer: core.viewer
            };
            
			this.$el.html(this.template(this.context));
            
            this.$pageTitle = this.$el.find('#page_title');
            
            this.$replyBtn = this.$el.find('#conversation_reply_btn');
            
            this.$listHolder = this.$el.find('#message_list_view_holder');
			
			return this;
		},
		inject: function(){
			
			var self = this;
			
            this.$holder = $(this.region.main);
			
            this.$holder.html(this.$el);
			
            this.$scroller = this.$el.find(this.region.content);
            
			this.$scroller.ensureVerticalScroll();
			
			// conversation info
            utils.api.get('message/conversation_detail', {
				iConversationId: this.model.getId()
			})
			.done(function(data) {
				if (data.hasOwnProperty('error_code') && data.error_code) {
					utils.modal.alert(data.error_message);
					return;
				}
				
                self.model.set(data);
                
                self.updateInfo();
			});
			
            // message list
			new ListView({}, this.$listHolder, this.$scroller, {loadmore: false, loadnew: false})
            .render({iItemId: this.model.getId()})
            .inject();
		},
        updateInfo: function () {
            this.$pageTitle.html(this.model.getTitle());
            
            if (this.model.getFolder() != 'sent') {
                this.$replyBtn.removeClass('hide');
            }
            
            this.appendRecipients();
        },
		appendRecipients : function(aRecipients) {
			var aRecipients = this.model.getRecipients();
			
            //remove current user from list
			var iViewerId = core.viewer.getId();
			var iRemove = -1;

			$.each(aRecipients, function(index, aRecipient) {
				if (aRecipient.iUserId == iViewerId) {
					iRemove = index;
				}
			});

			if (iRemove > -1) {
				aRecipients.splice(iRemove, 1);
			}
			
			var lessSpan = $('#recipients_list_less');
			var moreSpan = $('#recipients_list_more');
			
			lessSpan.empty();
			moreSpan.empty();
			
			lessSpan.append('<a href="#user/' + aRecipients[0].iUserId + '">' + aRecipients[0].sUserName + '</a>');
			
			if (aRecipients.length > 1) {
	            lessSpan.append(' and ' + (aRecipients.length - 1) + ' others');
	            
	            var moreList = "";
	            _.each(aRecipients, function (aRecipient) {
	            	moreList += ', <a href="#user/' + aRecipient.iUserId + '">' + aRecipient.sUserName + '</a>';
	            });
	            moreSpan.html(moreList.substring(2));
	            
	            $('#toggle_recipients').removeClass("hide");
	        }
	        
	        $('#message-recipient-list').removeClass("hide");
		},
		toggleRecipients : function(evt) {
			var target = $(evt.currentTarget);
			var lessSpan = $('#recipients_list_less');
			var moreSpan = $('#recipients_list_more');

			lessSpan.toggleClass("hide");
			moreSpan.toggleClass("hide");
			
			current = target.html();
			target.html(current == "More" ? "Less" : "More");
		},
		deleteConversation: function (evt) {
			var self = this;
			var target = $(evt.currentTarget);
			
			if (target.hasClass("processing")) {
				return;
			}
			
			utils.modal.confirm("Are you sure to delete this message?", function (selected) {
				if (selected == 1) {
					target.addClass("processing");
					
					var sendData = {
						iItemId: self.model.getId(),
                        sType: (self.model.getFolder() == 'sent') ? 'sentbox' : self.model.getFolder()
					};
					
					utils.api.post("message/delete", sendData)
					.done(function (data) {
						if (data.hasOwnProperty('error_code') && data.error_code) {
							utils.modal.alert(data.error_message);
							return;
						}
						
						utils.history.goRoot();
					})
					.complete(function () {
						target.removeClass("processing");
					});
				}
			}, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
		}
	});
});
