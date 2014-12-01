define([
    'marketplace/view/listing-invite-list',
    'text!marketplace/tpl/listing-invite.html',
    'user/collection/user'
], function(ListView, text, UserCollection) {

    return Backbone.View.extend({
        region: {
            wrapper: '#main',
            scroller: '#content',
            listViewHolder: '#listing-invite-list'
        },
        initialize: function() {
            this.invitePeople = new UserCollection();
        },
        template: _.template(text),
        render: function() {

            this.$el.html(this.template());

            this.$scroller = this.$el.find(this.region.scroller);
            this.$listViewHolder = this.$el.find(this.region.listViewHolder);
            this.$inviteBtn = this.$el.find('#invite_btn');

            return this;
        },
        inject: function() {

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            // get user list
            this.listView = new ListView({}, this.$listViewHolder, this.$scroller, {
                loadmore: false,
                loadnew: false
            });

            this.listView.render({
                iListingId: this.model.getId()
            }).inject();

            return this;
        },
        events: {
            "click .listing-invite-item": "clickItem",
            "click #markall_btn": "markAll",
            "click #unmarkall_btn": "unmarkAll",
            "click #invite_btn": "invite"
        },
        clickItem: function(evt) {

            if (!$(evt.target).is(':checkbox')) {
                var checkbox = $(evt.currentTarget).find(':checkbox');

                if (checkbox.is(':checked')) {
                    checkbox.prop('checked', false);
                } else {
                    checkbox.prop('checked', true);
                }
            }
        },
        markAll: function(evt) {
            $(':checkbox').prop('checked', true);
        },
        unmarkAll: function(evt) {
            $(':checkbox').prop('checked', false);
        },
        invite: function(evt) {
            if (this.$inviteBtn.isProcessing()) {
                return false;
            }

            var aUserId = new Array();
            $(":checkbox:checked").each(function() {
                aUserId.push($(this).data('id'));
            });

            if (aUserId.length == 0) {
                utils.modal.alert(_t('Please select friend to invite.'));
                return false;
            }

            var postData = {
                iListingId: this.model.getId(),
                sUserId: aUserId.join(',')
            };
            var settings = {
                context: this,
                timeout: 0
            };

            this.$inviteBtn.isProcessing(true);

            // post invite
            utils.api.post('marketplace/invite', postData, settings).done(this.doInviteComplete).fail(this.doInviteFail).always(this.doInviteAlways);
        },
        doInviteComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server.'));
            }

            utils.modal.toast('Invited member(s) successfully!');
            utils.history.back();
        },
        doInviteFail: function() {

            utils.debug.warn('FAIL: marketplace/invite', arguments);
        },
        doInviteAlways: function() {

            this.$inviteBtn.isProcessing(false);
        }
    });
});