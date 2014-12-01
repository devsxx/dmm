define([
    'forum/view/forum-poll-setting',
    'poll/view/poll-detail',
    'poll/view/poll-vote-popup',
    'text!forum/tpl/forum-poll-item.html'
], function(SettingView, PollDetailView, PollVotePopupView, text) {

    return PollDetailView.extend({
        region: {},
        settingView: SettingView,
        template: _.template(text),
        render: function() {

            this.voteListQuery = {
                iPollId: this.model.getId()
            };

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                item: this.model
            }));

            this.$answers_holder = this.$el.find('#poll_answers_holder');
            this.$results_holder = this.$el.find('#poll_results_holder');

            return this;
        },
        inject: function(callback) {

            callback(this.$el);

            this.updateResults();

            this.model.isVoted() ? this.viewResults() : this.viewAnswers();

            return this;
        },
        events: {
            'click .poll-answers-item': 'votePoll',
            'viewanswers': 'viewAnswers',
            'viewresults': 'viewResults',
            'viewvoters': 'viewVoteList'
        },
        viewResults: function(evt) {

            this.$answers_holder.addClass('hide');
            this.$results_holder.removeClass('hide');
        },
        viewAnswers: function(evt) {

            this.$results_holder.addClass('hide');
            this.$answers_holder.removeClass('hide');
        },
        viewVoteList: function(evt) {

            if (!this.votePopupView) {
                this.votePopupView = new PollVotePopupView();
            }

            this.votePopupView.render(this.voteListQuery).inject();
        },
        voteSuccess: function($target, data) {

            if (data.message) {
                utils.modal.toast(data.message);
            }

            this.$el.find('.poll-checkbox').removeClass('checked');
            $target.find('.poll-checkbox').addClass('checked');

            this.$answers_holder.addClass('disabled');

            this.model.set(data);

            this.updateResults();
            this.viewResults();
        }
    });
});