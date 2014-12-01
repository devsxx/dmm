define([
    'text!quiz/tpl/quiz-start.html',
    'text!quiz/tpl/quiz-start-update.html'
], function (text, textUpdate) {

    return Backbone.ItemView.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            updateHolder: '#quiz_start_holder'
        },
        template: _.template(text),
        templateUpdate: _.template(textUpdate),
        events: {
            "click #next_btn": "nextQuestion",
            "click #prev_btn": "prevQuestion",
            "click #submit_btn": "submitAnswer",
	    "click .quiz_answer": "clickAnswer",
            "click .btn-back": "confirmBack"
        },
        render: function () {

            this.$questionList = $('#question_list');

            this.$el.html(this.template({
                item: this.model
            }));
            // get elements
            this.$holder = $(this.region.holder);
            this.$scroller = this.$el.find(this.region.scroller);
            this.$updateHolder = this.$el.find(this.region.updateHolder);
            this.$pageTitle = this.$el.find('#page_title');
            this.$prevButton = this.$el.find('#prev_btn');
            this.$nextButton = this.$el.find('#next_btn');

            this.$el.attr({
                id: this.model.getDataId()
            });

            return this;
        },
        inject: function () {

            this.$holder.html(this.$el);
            this.$scroller.ensureVerticalScroll();

            // get questions data
            this.fetchData();
        },
        fetchData: function () {
            utils.api.get('quiz/questions', {iQuizId: this.model.getId()}, {context: this})
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

            // set current question to 1 to start
            this.currentQuestion = 1;

            //get total of questions
            this.totalQuestion = this.model.getQuestions().length;

            //this don't have effect, just to set prev/next button status
            this.goToQuestion(1);

            //actually toggle question 1
            $('li').eq(0).toggle();

        },
        clickAnswer: function (evt) {
            var ele = $(evt.target).parent(),
                questionid = ele.data('questionid'),
                answerid = ele.data('answerid');

            // remove other answer status
            ele.parent('.quiz_list_answer').children('.quiz_answer').removeClass('checked');

            // set status of current answer
            ele.addClass('checked');

            // send the anser id to hidden input
            $("#"+questionid ).val( answerid );
        },
        nextQuestion: function (evt) {

            // return if last question
            if ($(evt.target).hasClass('disabled')) {
                return
            }

            // go to next question
            this.goToQuestion(this.currentQuestion + 1);
        },
        prevQuestion: function (evt) {

            if ($(evt.target).hasClass('disabled')) {
                return;
            }

            this.goToQuestion(this.currentQuestion - 1);
        },
        goToQuestion: function (index) {
            // this function is for jumping to an question
            // used to go back/pre and jump to not answered question when submit

            // set status for pre button
            if (index == 1) {
                this.$prevButton.addClass('disabled');
            } else {
                this.$prevButton.removeClass('disabled');
            }

            // set status for next button
            if (index == this.totalQuestion) {
                this.$nextButton.addClass('disabled');
            } else {
                this.$nextButton.removeClass('disabled');
            }

            // do nothing if staying at current question
            if (this.currentQuestion == index) {
                return
            }

            // go to specific question
            // hide current question
            $('li').eq(this.currentQuestion - 1).hide();

            // show target question
            $('li').eq(index - 1).show();

            // set new current question number
            this.currentQuestion = index;
        },
        submitAnswer: function() {

            var self = this;
            // start collect answer data, return if an question is not answer
            if (!this.collectAnswer()){
                return;
            }

            var sendData = {
                iQuizId: this.model.getId(),
                aAnswers: this.answerData
            }

            // start submit data
            utils.api.post('quiz/answer', sendData).done(function(data){
                $.extend(data,{iQuizId: self.model.getId()});
                    self.submitSuccess(data);
            }).fail(this.submitFail);
        },
        collectAnswer: function () {

            var self = this;

            // flag to pass if every questions is answered
            var collectResult = true;

            self.answerData = new Array();

            var currentQuestion = 0;

            // scan through questions
            $('li').each(function(index, ele){

                // get question id
                currentQuestion = $(ele).data('questionid');

                // get current answer from the hidden input
                var currentAnswer = $(ele).children("input").val();

                // check if current answer if not null
                if (currentAnswer) {
                    self.answerData.push({iQuestionId: currentQuestion, iAnswerId: currentAnswer});
                } else {
                    utils.modal.toast(_t('You have to answer all questions to submit'));

                    // go to unanswered question
                    self.goToQuestion(index + 1);

                    // set pass flag to false
                    collectResult = false;

                    // break the loop
                    return false;
                }
            });

            return collectResult;
        },
        submitSuccess: function (data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            // submit success
            utils.modal.toast(_t('Your answers has been submited successfully.'));

            window.location.href = "#quiz/" + data.iQuizId + "/result/" + Backbone.iUserId;
        },
        submitFail: function (data) {

                utils.modal.alert(_t('Can not load data from server'));
        },
        confirmBack: function () {

            utils.modal.confirm(_t("Are you sure you want to leave this page? All your answers will be clean."), function (selected) {
                if (selected == 1) {

                    utils.history.back();
                }
            }, _t('Confirm'), [_t('Yes'),_t('No')]);
        }
    });
});