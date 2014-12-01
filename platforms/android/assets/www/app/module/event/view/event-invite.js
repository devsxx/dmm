define([
	'text!event/tpl/event-invite.html',
	'event/view/event-invite-list',
	'user/collection/user'
], function(text, ListView, UserCollection){
	
	return Backbone.View.extend({
		region: {
			wrapper: '#main',
			scroller: '#content',
			listViewHolder: '#event-invite-list'
		},
		initialize: function(){
			this.invitePeople = new UserCollection();
		},
		template: _.template(text),
        render: function(){
        	
            this.$el.html(this.template());
            
            this.$scroller = this.$el.find(this.region.scroller);
            this.$listViewHolder  = this.$el.find(this.region.listViewHolder);
            this.$inviteBtn = this.$el.find('#invite_btn');
            			
			return this;
		},
        inject: function(){
        	
			$(this.region.wrapper).html(this.$el);
			
			this.$scroller.ensureVerticalScroll();
			
			// get user list
			
			this.listView = new ListView({}, this.$listViewHolder, this.$scroller,{loadmore:false, loadnew: false});
			
			this.listView.render({iEventId: this.model.getId()}).inject();
			return this;
		},
		events: {
			"click .event-invite-item": "clickItem",
			"click #markall_btn": "markAll",
			"click #unmarkall_btn": "unmarkAll",
			"click #invite_btn": "invite"
		},
		clickItem: function (evt) {
			
			if (!$(evt.target).is(':checkbox')) {
				var checkbox = $(evt.currentTarget).find(':checkbox');
	            
	            if (checkbox.is(':checked')) {
	                checkbox.prop('checked', false);
	            } else {
	                checkbox.prop('checked', true);
	            }
			}
		},
		markAll: function (evt) {
			$(':checkbox').prop('checked', true);
		},
		unmarkAll: function (evt) {
			$(':checkbox').prop('checked', false);
		},
		invite: function (evt) {
			if (this.$inviteBtn.isProcessing()) {
				return false;
			}
			
			var aUserId = new Array();
	        $(":checkbox:checked").each(function () {
	            aUserId.push($(this).data('id'));
	        });
	        
	        if (aUserId.length == 0) {
	            utils.modal.alert(_t('Please select friend to invite.'));
	            return false;
	        }
	        
	        var sendData = {
	        	"iEventId": this.model.getId(),
                "sUserId": aUserId.join(',')
	        }, settings = {
	        	'context': this
	        }
	        
	        this.$inviteBtn.isProcessing(true);
	        
	        utils.api.post("event/invite", sendData, settings)
//	        .done(this.doInviteComplete)
//	        .fail(this.doInviteFail)
            .always(function () {
                // not check result
                this.$inviteBtn.isProcessing(false);
                utils.modal.toast("Invited member(s) successfully!");
				utils.history.back();
            });
		},
		doInviteComplete: function (data) {
        	if (data.error_code && data.error_code > 0) {
				utils.modal.alert(data.error_message);
			}else{
				utils.modal.toast("Invited member(s) successfully!");
				utils.history.back();
			}
			this.$inviteBtn.isProcessing(false);
        },
		doInviteFail: function(){
			var msg = _t('Could not send invite');
			utils.modal.alert(msg);
			this.$inviteBtn.isProcessing(false);
		}
	});
});