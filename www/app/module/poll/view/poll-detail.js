define([
    'poll/view/poll-item',
    'poll/view/poll-topmenu',
    'poll/view/poll-vote-list',
    'text!poll/tpl/poll-detail-results-item.html',
    'text!poll/tpl/poll-detail-update.html',
    'text!poll/tpl/poll-detail.html',
    'text!poll/tpl/poll-pending-msg.html',
    'text!poll/tpl/poll-vote-item-min.html'
], function(ItemView, TopMenuView, PollVoteListView, textResultsItem, textUpdate, text, textPendingMsg, textVoteItemMin) {

    return ItemView.extend({
        className: 'poll-item',
        region: {
            holder: '#main',
            scroller: '#content',
            updateHolder: '#poll_detail_holder',
            activityExtraHolder: '#activity_extra_holder',
            voteListHolder: '#poll_vote_list_holder'
        },
        template: _.template(text),
        templatePendingMsg: _.template(textPendingMsg),
        templateResultsItem: _.template(textResultsItem),
        templateUpdate: _.template(textUpdate),
        templateVoteItemMin: _.template(textVoteItemMin),
        topMenuView: TopMenuView,
        render: function() {

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $(this.region.holder);
            this.$scroller = this.$el.find(this.region.scroller);
            this.$update_holder = this.$el.find(this.region.updateHolder);
            this.$activity_extra_holder = this.$el.find(this.region.activityExtraHolder);
            this.$vote_list_holder = this.$el.find(this.region.voteListHolder);
            this.$page_title = this.$el.find('#page_title');
            this.$topmenu_btn = this.$el.find('#top_menu_toggle');
            this.$footer_menu_item = this.$el.find('.footer .menu-item');
            this.$show_answers_btn = this.$el.find('#show_answers_btn');
            this.$show_results_btn = this.$el.find('#show_results_btn');
            this.$show_voters_btn = this.$el.find('#show_voters_btn');

            return this;
        },
        inject: function() {

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            utils.helper.addActivityExtraBlock(this.model, this.$activity_extra_holder, this.$scroller);

            return this;
        },
        fetchData: function() {

            var postData = {
                iPollId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.post('poll/detail', postData, settings).done(this.fetchDone).fail(this.fetchFail);
        },
        fetchDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server.'));
                return utils.history.back();
            }

            this.model.set(data);

            this.appendUpdateView();
        },
        fetchFail: function(jqXHR, textStatus, errorThrown) {

            utils.debug.warn('[FAIL] poll/detail', arguments);
            utils.modal.alert(_t('Can not load data from server.'));
            utils.history.back();
        },
        appendUpdateView: function() {

            if (!this.model.canView()) {
                return this.$el.html(utils.helper.privatepage());
            }

            if (!this.model.isApproved()) {
                this.$update_holder.before(this.templatePendingMsg());
            }

            this.$page_title.html(this.model.getQuestion());

            if (this.model.isOwner() || this.model.canDislike()) {
                this.$topmenu_btn.removeClass('hide');
            }

            this.$update_holder.html(this.templateUpdate({
                item: this.model
            }));

            this.$answers_holder = this.$el.find('#poll_answers_holder');
            this.$results_holder = this.$el.find('#poll_results_holder');
            this.$vote_list_wrapper_min = this.$el.find('#poll_vote_list_wrapper_min');
            this.$vote_count_num = this.$el.find('#poll_vote_count_num');
            this.$vote_list_holder_min = this.$el.find('#poll_vote_list_holder_min');

            this.appendVoters();

            this.updateView();
        },
        updateView: function() {

            this.updateResults();

            this.$show_results_btn.toggleClass('hide', !this.model.canViewResult());

            this.$show_voters_btn.add(this.$vote_list_wrapper_min).toggleClass('hide', !this.model.canViewUserResult());

            if (this.model.isApproved() && this.model.isVoted() && this.model.canViewResult()) {
                this.viewResults();
            } else {
                this.viewAnswers();
            }
        },
        updateResults: function() {

            this.$results_holder.empty();

            _.each(this.model.getAnswers(), function(answer) {
                this.$results_holder.append(this.templateResultsItem({
                    item: answer
                }));
            }, this);
        },
        appendVoters: function() {

            this.voteListQuery = {
                iPollId: this.model.getId()
            };

            this.voteListView = new PollVoteListView({}, this.$vote_list_holder, this.$scroller, {
                loadnew: false,
                loadmore: false
            });

            this.voteListView.render(this.voteListQuery).inject();

            this.voteListView.on('parsedatasuccess', this.updateVoteListMin, this);
        },
        updateVoteListMin: function(items) {

            this.$vote_count_num.html(this.model.getTotalVote());

            this.$vote_list_holder_min.empty();

            _.each(items.slice(0, 6), function(item) {
                this.$vote_list_holder_min.append(this.templateVoteItemMin({
                    item: item
                }));
            }, this);
        },
        events: {
            'click #poll_vote_count': 'viewVoteList',
            'click #show_answers_btn': 'viewAnswers',
            'click #show_results_btn': 'viewResults',
            'click #show_voters_btn': 'viewVoteList',
            'click #top_menu_toggle': 'toggleTopMenu',
            'click .poll-answers-item': 'votePoll'
        },
        viewAnswers: function(evt) {

            this.$footer_menu_item.removeClass('current');
            this.$show_answers_btn.addClass('current');
            this.$results_holder.add(this.$vote_list_holder).addClass('hide');
            this.$answers_holder.add(this.$update_holder).add(this.$activity_extra_holder).removeClass('hide');
        },
        viewResults: function(evt) {

            this.$footer_menu_item.removeClass('current');
            this.$show_results_btn.addClass('current');
            this.$answers_holder.add(this.$vote_list_holder).addClass('hide');
            this.$results_holder.add(this.$update_holder).add(this.$activity_extra_holder).removeClass('hide');
        },
        viewVoteList: function(evt) {

            this.$footer_menu_item.removeClass('current');
            this.$show_voters_btn.addClass('current');
            this.$update_holder.add(this.$activity_extra_holder).addClass('hide');
            this.$vote_list_holder.removeClass('hide');
        },
        votePoll: function(evt) {

            var $target = $(evt.currentTarget);

            if (this.$answers_holder.find('.processing').length > 0 || this.$answers_holder.hasClass('disabled')) {
                return;
            }

            $target.addClass('processing');

            var postData = {
                iPollId: this.model.getId(),
                iAnswerId: $target.data('answerid')
            };

            var settings = {
                context: this
            };

            utils.api.post('poll/vote', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                this.voteSuccess($target, data);
            }).always(function() {
                $target.removeClass('processing');
            });
        },
        voteSuccess: function($target, data) {

            if (data.message) {
                utils.modal.toast(data.message);
            }

            this.$el.find('.poll-checkbox').removeClass('checked');
            $target.find('.poll-checkbox').addClass('checked');

            this.$answers_holder.addClass('disabled');

            this.model.set(data);

            this.updateView();

            this.voteListView.resetQuery(this.voteListQuery);
        },
        toggleTopMenu: function() {

            this.topMenuIsShown(false);

            utils.topMenu.toggle(this, this.model);
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message || _t('Poll successfully deleted.'));

            utils.history.back();
        }
    });
});