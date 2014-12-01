define([
    'text!quiz/tpl/quiz-user-result.html',
    'text!quiz/tpl/quiz-user-answer-item.html'
], function (text, textAnswer) {

    return Backbone.View.extend({

        region: {
            holder: '#main',
            scroller: '#content',
            updateHolder: '#poll_detail_holder',
            activityExtraHolder: '#activity_extra_holder'
        },
        template: _.template(text),
        templateAnswer: _.template(textAnswer),
        render: function (context) {

            this.context = $.extend({
                iQuizId: null,
                iUserId: null
            }, context);

            this.$el.html(this.template(this.context));

            this.$holder = $(this.region.holder);
            this.$scroller = this.$el.find(this.region.scroller);
            this.$pageTitle = this.$el.find('#page_title');
            this.$resultTitle = this.$el.find('#result_title');
            this.$resultPercent = this.$el.find('#result_percent');
            this.$resultHolder = this.$el.find('#quiz_user_result_holder');
            return this;
        },
        inject: function () {
            console.log(textAnswer);

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();
        },
        events: {
            // custom back button
            'click .btn-back': 'backToResults'
        },
        fetchData: function () {
            utils.api.get('quiz/result', {iQuizId: this.context.iQuizId, iUserId: this.context.iUserId}, {context: this})
                .done(this.fetchDataComplete)
                .fail(this.fetchDataFail);
        },
        fetchDataComplete: function (data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.formData = data;

            this.updateView();
        },
        fetchDataFail: function () {
            utils.debug.log(arguments);
            utils.history.back();
        },
        updateView: function () {

            this.$pageTitle.html(this.formData.sTitle);
            this.$resultTitle.html(this.formData.sFullName);
            this.$resultPercent.html(" ( " + this.formData.iSuccessPercentage + " % )");
            this.$resultTitle.attr('href', '#user/' + this.context.iUserId);

            this.appendResult();
        },
        appendResult: function () {

            var self = this;
            // pass user avatar to single answer to show
            userAvatar = this.formData.sUserImage;

            // loop through answer to append to list
            _.each(self.formData.aAnswers, function(answer, index){

                // add the index to single answer index start with 0 so +1
                answer = $.extend({iAnswerId: 0}, answer);
                $.extend(answer, {iIndex: index + 1, sImgSrc: userAvatar});

                // append answer with data
                self.$resultHolder.append(self.templateAnswer(answer));
            });
        },
        backToResults: function () {
            window.location.href = "#quiz/" + this.context.iQuizId + "/results";
        }
    });
});