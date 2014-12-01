define([
    'text!quiz/tpl/quiz-detail.html',
    'text!quiz/tpl/quiz-detail-update.html',
    'quiz/view/quiz-item',
    'quiz/view/quiz-top-menu'
], function (text, textUpdate, ItemView, TopMenuView) {

    return ItemView.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            updateHolder: '#quiz_detail_holder',
            activityExtraHolder: '#activity_extra_holder'
        },
        template: _.template(text),
        templateUpdate: _.template(textUpdate),
        topMenuView: TopMenuView,
        render: function () {

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $(this.region.holder);
            this.$scroller = this.$el.find(this.region.scroller);
            this.$updateHolder = this.$el.find(this.region.updateHolder);
            this.$activityExtraHolder = this.$el.find(this.region.activityExtraHolder);
            this.$pageTitle = this.$el.find('#page_title');
            this.$showResultsBtn = this.$el.find('#show_results_btn');
            this.$showAnswersBtn = this.$el.find('#show_anwsers_btn');

            this.$el.attr({
                id: this.model.getDataId()
            });

            return this;
        },
        inject: function () {

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            utils.helper.addActivityExtraBlock(this.model, this.$activityExtraHolder, this.$scroller);

            return this;
        },
        fetchData: function () {
            utils.api.get('quiz/detail', {iQuizId: this.model.getId()}, {context: this})
                .done(this.fetchDataComplete)
                .fail(this.fetchDataFail);
        },
        fetchDataComplete: function (data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.model.set(data);
            this.updateView();
        },
        fetchDataFail: function () {
            utils.debug.log(arguments);
            utils.history.back();
        },
        updateView: function () {

            this.$pageTitle.html(this.model.getTitle());

            this.$updateHolder.html(this.templateUpdate({
                item: this.model
            }));

            this.$resultsHolder = this.$el.find('#quiz_results_holder');
            this.$answersHolder = this.$el.find('#quiz_answers_holder');
            this.$actionBar = this.$el.find('#quiz_action_bar');
            this.$activityExtraHolder.removeClass('hide');
        },
        events: {
            'click #show_results_btn': 'viewResults',
            'click #show_anwsers_btn': 'viewAnswers',
            'click .quiz-answers-item': 'votePoll',
//            'click #star_quiz_btn': 'startQuiz',
            'click #top_menu_toggle': 'toggleTopMenu'
        },
        toggleTopMenu: function () {

            utils.topMenu.toggle(this, this.model);
        },
        viewResults: function (evt) {


            this.$resultsHolder.empty();

            this.$answersHolder.add(this.$showResultsBtn).addClass('hide');
            this.$resultsHolder.add(this.$showAnswersBtn).removeClass('hide');
        },
        viewAnswers: function (evt) {

            this.$resultsHolder.add(this.$showAnswersBtn).addClass('hide');
            this.$answersHolder.add(this.$showResultsBtn).removeClass('hide');
        },
        votePoll: function (evt) {

            var $target = $(evt.currentTarget);

            if ($target.hasClass('processing') || !this.model.canVote()) {
                return;
            }

            $target.addClass('processing');

            var postData = {
                iPollId: this.model.getId(),
                iOptionId: $target.data('optionid')
            };

            var settings = {
                context: this
            };

            utils.api.post('quiz/vote', postData, settings)
                .done(function (data) {
                    if (data.error_code && data.error_code > 0) {
                        return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                    }

                    // success
                    this.voteSuccess($target, data);
                })
                .always(function () {
                    $target.removeClass('processing');
                });
        },
        voteSuccess: function ($target, data) {

            this.model.set(data);

            this.$el.find('.quiz-checkbox').removeClass('checked');
            $target.find('.quiz-checkbox').addClass('checked');

            this.$answersHolder.toggleClass('disabled', !this.model.canVote());

            this.viewResults();

            if (data.message) {
                utils.modal.toast(data.message);
            }
        },
        deleteSuccess: function (data) {

            utils.modal.toast(data.message);

            utils.history.back();
        }
    });
});