define([
    'text!page/tpl/page-invite.html',
    'page/view/page-invite-list'
], function(text, ListView) {

    return Backbone.View.extend({
        region: {
            wrapper: '#main',
            scroller: '#content',
            listViewHolder: '#page-invite-list'
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

            // get friend list
            this.listView = new ListView({}, this.$listViewHolder, this.$scroller, {
                loadmore: false,
                loadnew: false
            });

            this.listView.render({
                iPageId: this.model.getId()
            }).inject();

            return this;
        },
        events: {
            "click .page-invite-item": "clickItem",
            "click #markall_btn": "markAll",
            "click #unmarkall_btn": "unMarkAll",
            "click #invite_btn": "invite"
        },
        markAll: function(evt) {

            $(':checkbox').prop('checked', true);
        },
        unMarkAll: function(evt) {

            $(':checkbox').prop('checked', false);
        },
        invite: function(evt) {

            // prevent multiple touch
            if (this.$inviteBtn.isProcessing()) {
                return false;
            }

            // get user ids from elements
            var aUserId = new Array();

            $(':checkbox:checked').each(function() {
                aUserId.push($(this).data('id'));
            });

            // notify user if no friends is selected
            if (aUserId.length == 0) {

                utils.modal.alert(_t('Please select friend to invite'));

                return false;
            }

            // create data to be sent
            var data = {
                iPageId: this.model.getId(),
                sUserId: aUserId.join(',')
            };
            var settings = {
                context: this,
                timeout: 0
            };

            this.$inviteBtn.isProcessing(true);

            // post invite
            utils.api.post('pages/invite', data, settings).done(this.doInviteComplete).fail(this.doInviteFail).always(this.doInviteAlways);
        },
        doInviteComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server.'));
            } else {
                utils.modal.toast('Invited member(s) successfully!');
                utils.history.back();
            }
        },
        doInviteFail: function(jqXHR, textStatus, errorThrown) {

            utils.modal.alert(_t('Can not send invite. Please try again later.'));
        },
        doInviteAlways: function() {

            this.$inviteBtn.isProcessing(false);
        }
    });
});