//@TODO edit permission
define([
    'quiz/model/perms',
    'text!quiz/tpl/quiz-edit.html',
    'text!quiz/tpl/quiz-edit-form.html',
    'text!quiz/tpl/quiz-form-question.html',
    'text!quiz/tpl/quiz-form-answer.html',
    'text!quiz/tpl/quiz-attachment-photo.html'
], function(PermsModel, text, formText, formQuestion, formAnswer, tplAttachPhoto) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#quiz_edit_info',
            questionsHolder: '#quiz_edit_question_list'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        formQuestion: _.template(formQuestion),
        formAnswer: _.template(formAnswer),
        render: function(context) {

            this.context = $.extend({}, context);
            this.api = (this.context.sView == 'edit') ? "quiz/edit" : "quiz/add";

            this.$el.html(this.template(this.context));
            this.$formHolder = this.$el.find(this.region.formHolder);
            this.$questionsHolder = this.$el.find(this.region.questionsHolder);
            this.$saveBtn = this.$el.find('#save_btn');

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);
            this.$holder.html(this.$el);
            this.$scroller = $(this.region.scroller);
            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {

            // set variable according to sView : edit or add
            var api = (this.context.sView == 'edit') ? "quiz/formedit" : "quiz/formadd";

            utils.api.get(api, {
                iQuizId: this.model.getId()
            }, {
                context: this
            }).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            // check permissions
            this.perms = new PermsModel(data.perms);
            if ('edit' == this.context.sView) {
                if (!this.perms.canEditOwnQuiz()) {
                    utils.modal.alert(_t('You don\'t have permission to edit this item.'));
                    return utils.history.back();
                }
            } else {
                if (!this.perms.canCreateQuiz()) {
                    utils.modal.alert(_t('You don\'t have permission to add new item.'));
                    return utils.history.back();
                }
            }

            this.model.set(data);
            this.formData = data;
            this.updateView();
        },
        updateView: function(data) {
            this.$formHolder.html(this.formTemplate({
                item: this.model
            }));

            this.$pageTitle = this.$el.find('#page_title');
            this.$formTitle = this.$el.find('#quiz_form_title');
            this.$formDescription = this.$el.find('#quiz_form_description');
            this.$formPrivacy = this.$el.find('#quiz_form_privacy');
            this.$formPrivacyComment = this.$el.find('#quiz_form_privacy_comment');
            this.$photo_browse_btn = this.$el.find('#quiz_form_photo_browse');
            this.$photo_holder = this.$el.find('#quiz_form_photo_holder');
            this.$info_holder = this.$el.find('#quiz_edit_info');
            this.$questions_holder = this.$el.find('#quiz_edit_questions');
            this.$footer_info_btn = this.$el.find('#footer_info_btn');
            this.$footer_questions_btn = this.$el.find('#footer_questions_btn');

            this.minQuestion = this.formData.perms.iMinQuestion || 1;
            this.maxQuestion = this.formData.perms.iMaxQuestion || 999;
            this.minAnswer = this.formData.perms.iMinAnswer || 1;
            this.maxAnswer = this.formData.perms.iMaxAnswer || 25;

            if (this.context.sView == 'edit') {
                this.$pageTitle.html(_t('Editing Quiz'));

                if (this.perms.canEditOwnQuestion()) {
                    this.$footer_questions_btn.removeClass('hide');
                    this.updateQuestions();
                }
                if (this.perms.canEditOwnTitle()) {
                    this.$footer_info_btn.removeClass('hide');
                    this.viewInfo();
                } else {
                    this.viewQuestions();
                }
            } else {
                this.$pageTitle.html(_t('Adding Quiz'));

                this.$footer_info_btn.add(this.$footer_questions_btn).removeClass('hide');
                this.viewInfo();

                for (i = 0; i < this.minQuestion; i++) {
                    this.addQuestion({});
                }
            }

        },
        fetchDataFail: function() {
            utils.debug.log(arguments);
            utils.history.back();
        },
        events: {
            'click #save_btn': 'saveData',
            'click #footer_info_btn': 'viewInfo',
            'click #footer_questions_btn': 'viewQuestions',
            'click #add_question_btn': 'addQuestion',
            'click #remove_question_btn': 'removeQuestion',
            'click #add_answer_btn': 'addAnswer',
            'click #remove_answer_btn': 'removeAnswer',
            'click #correct_answer_btn': 'correctAnswer',
            'click #quiz_form_photo_browse': "browsePhoto",
            'click #quiz_form_photo_remove': "removePhoto"
        },
        saveData: function(evt) {
            var $target = $(evt.currentTarget);

            if ($target.hasClass('processing')) {
                return;
            }

            var sTitle = this.$formTitle.val();
            var sDescription = this.$formDescription.val();
            var sPrivacy = this.$formPrivacy.val() || 'everyone';
            var sPrivacyComment = this.$formPrivacyComment.val() || 'everyone';

            // validate
            if (!sTitle.trim()) {
                return utils.modal.alert(_t('Title is required.'));
            }

            if (!sDescription.trim()) {
                return utils.modal.alert(_t('Description is required.'));
            }

            if (!this.collectQuestions()) {
                utils.modal.alert(_t('Questions and answers cannot be empty'))
                return;
            }

            // passed
            var postData = {
                iQuizId: this.model.getId(),
                sTitle: sTitle,
                sDescription: sDescription,
                aQuestions: JSON.stringify(this.questionData),
                sAuthView: sPrivacy,
                sAuthComment: sPrivacyComment
            };

            var settings = {
                context: this,
                "beforeSend": this.beforeSave,
                "complete": this.saveComplete
            }

            $target.addClass('processing');

            var quiz_photo_el = $('#quiz_form_photo');


            if (quiz_photo_el.length > 0) {
                var quiz_photo_src = quiz_photo_el.data("src");
                this.saveQuizWithPhoto(this.api, postData, settings, quiz_photo_src);
            } else {
                this.saveQuiz(this.api, postData, settings);
            }
        },
        updateQuestions: function() {

            // append quiz current questions to form
            var self = this;

            //get and create questions list
            var aQuestions = this.model.getQuestions();
            _.each(aQuestions, function(question) {
                self.$questionsHolder.append(self.formQuestion(question));
                var $answersHolder = $('.answers-list:last');
                _.each(question.answers, function(answer) {
                    $answersHolder.append(self.formAnswer(answer));
                });
            });
            this.fixQuestionIndex();
            this.$scroller.trigger('refresh');
        },
        fixQuestionIndex: function() {

            // this function reset all question number
            var questionCnt = this.$questionsHolder.find('.question-form').length;

            $('.question-form').each(function(index, questionEle) {

                $(questionEle).children('.question-number-title:first').html('Question ' + (index + 1));
            });
        },
        addQuestion: function() {

            //            @TODO consider using this to add question with data when editing

            var self = this;

            var questionCnt = this.$questionsHolder.find('.question-form').length;
            //check for max question limit
            if (questionCnt >= this.maxQuestion) {
                return utils.modal.alert(_t('You can add maximum ' + this.maxQuestion + ' questions.'));
            }

            //add an question
            this.$questionsHolder.append(this.formQuestion);
            var $answersHolder = $('.answers-list:last');
            for (i = 0; i < self.minAnswer; i++) {
                $answersHolder.append(self.formAnswer);
            }
            //set the first answer to correct
            $answersHolder.find('.single-answer:first').addClass('correct');

            // fix questions index
            this.fixQuestionIndex();

            // fix scroller height
            this.$scroller.trigger('refresh');
        },
        removeQuestion: function(evt) {
            //check for minimum question limit
            var questionCnt = this.$questionsHolder.find('.question-form').length;
            if (questionCnt <= this.minQuestion) {
                return utils.modal.alert(_t('Quiz must has minimum ' + this.minQuestion + ' question(s).'));
            }

            // remove whole question
            $(evt.target).parents('.question-form').remove();

            // reset question index
            this.fixQuestionIndex();

            // fix scroller height
            this.$scroller.trigger('refresh');
        },
        addAnswer: function(evt) {

            // get current answer list according to eventt target
            var $answerList = $(evt.target).parents('.answers-list');

            // check for max question limit
            var answerCnt = $answerList.find('.single-answer').length;

            if (answerCnt >= this.maxAnswer) {
                return utils.modal.alert(_t('You can add maximum ' + this.maxAnswer + ' answers to a question.'));
            }

            // append answer to current answer list
            $answerList.append(this.formAnswer);

            // fix scroller height
            this.$scroller.trigger('refresh');
        },
        removeAnswer: function(evt) {

            var $answerList = $(evt.target).parents('.answers-list');

            // check for min question
            var answerCnt = $answerList.find('.single-answer').length;

            if (answerCnt <= this.minAnswer) {
                return utils.modal.alert(_t('Question must has minimum ' + this.minAnswer + ' answer(s).'));
            }

            // do not remove correct anser
            // @TODO maybe automatically set the first answer to corrent instead of alert
            if ($(evt.target).parents('.single-answer').hasClass('correct')) {
                return utils.modal.alert(_t('Correct answer cannot be removed.'));
            }

            // remove answer
            $(evt.target).parents('.single-answer').remove();

            // fix scroller height
            this.$scroller.trigger('refresh');
        },
        correctAnswer: function(evt) {

            // set click answer to correct, remove other correct first
            $(evt.target).parents('.single-answer').siblings('.single-answer').removeClass('correct');
            $(evt.target).parents('.single-answer').addClass('correct');
        },
        viewInfo: function(evt) {

            this.$questions_holder.addClass('hide');
            this.$info_holder.removeClass('hide');
            this.$footer_questions_btn.removeClass('current');
            this.$footer_info_btn.addClass('current');
        },
        viewQuestions: function(evt) {

            this.$info_holder.addClass('hide');
            this.$questions_holder.removeClass('hide');
            this.$footer_info_btn.removeClass('current');
            this.$footer_questions_btn.addClass('current');
        },
        collectQuestions: function() {

            var self = this;

            // create question data
            self.questionData = new Array();

            // set collect result flag default to true
            var collectResult = true;

            // get questions from question forms
            $('.question-form').each(function(index, questionEle) {

                // create temp question data to be pushed to self.questionData array
                var questionData = {};

                //get current question
                var currentQuestion = $(questionEle).find('.question-title:first').val();

                // get current ID (only affect editing)
                var currentQuestionID = $(questionEle).data('questionid') || '';

                // break and announce if data is null
                if (!currentQuestion) {
                    collectResult = false;
                    return false;
                }

                // add current question to data
                $.extend(questionData, {
                    sQuestion: currentQuestion,
                    iQuestionId: currentQuestionID
                });

                // create temporary answers data
                var answers = new Array();

                //get answers for current question
                $(questionEle).find('.single-answer').each(function(index, answerEle) {

                    // get temp current answer and check for null
                    var currentAnswer = $(answerEle).find(':text').val();
                    var currentAnswerId = $(answerEle).data('answerid') || '';
                    if (!currentAnswer) {
                        collectResult = false;
                        return false;
                    }

                    // check correct class to set if answer is correct
                    var currentAnswerResult = $(answerEle).hasClass('correct') ? 1 : 0;

                    // push an answer data to anser array
                    answers.push({
                        sAnswer: currentAnswer,
                        iAnswerId: currentAnswerId,
                        bIsCorrect: currentAnswerResult
                    });
                });

                // put answer data to temp question
                $.extend(questionData, {
                    aAnswers: answers
                });

                // add to final question data
                self.questionData.push(questionData);
            });

            return collectResult;
        },
        browsePhoto: function(evt) {
            var self = this;

            navigator.camera.getPicture(getPictureSuccess, getPictureFail, {
                quality: 10,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            });

            function getPictureSuccess(imageURI) {
                self.addPhoto(imageURI);
            }

            function getPictureFail(msg) {
                utils.debug.log(msg);
            }
        },
        addPhoto: function(imageURI) {

            var photo_item = _.template(tplAttachPhoto, {
                imageURI: imageURI
            });

            this.$photo_holder.html(photo_item);

            this.$photo_browse_btn.addClass('hide');
        },
        saveQuiz: function(api, data, settings) {
            var self = this;

            utils.api.post(api, data, settings).done(function(data) {
                self.saveDone(data, api);
            });
        },
        saveQuizWithPhoto: function(api, data, settings, path) {
            var self = this;

            utils.api.uploadImage(api, path, data).done(function(data) {
                self.saveDone(data, api);
            });
        },
        beforeSave: function() {
            $('#save_btn').addClass("processing");
        },
        saveComplete: function() {
            $('#save_btn').removeClass("processing");
        },
        saveDone: function(data, api) {

            if (null != data.error_code && 0 != data.error_code) {
                utils.modal.alert(data.error_message);
                return;
            }
            // save success

            if (api == 'quiz/edit') {
                utils.modal.toast(_t('Quiz has been updated successfully.'));
                utils.history.back();
            } else {
                utils.modal.toast("Quiz has been created successfully.");
                window.location.href = "#quizzes/my";
            }
        },
        removePhoto: function() {

            this.$photo_holder.empty();

            this.$photo_browse_btn.removeClass('hide');
        }
    });
});