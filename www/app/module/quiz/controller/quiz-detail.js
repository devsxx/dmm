define([
    'quiz/model/quiz',
    'quiz/view/quiz-detail',
    'quiz/view/quiz-start',
    'quiz/view/quiz-detail-results',
    'quiz/view/quiz-user-result'
], function (Model, DetailView, QuizStartView, QuizResultsView, QuizUserResultView) {

    var DetailController = function (id) {
        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iQuizId: id
            })
        }).render().inject();
    };

    var QuizStartController = function (id) {

        utils.observer.trigger('router:changed');

        new QuizStartView({
            model: new Model({
                iQuizId: id
            })
        }).render().inject();
    };

    var QuizResultsController = function (id) {
        utils.history.push();

        utils.observer.trigger('router:changed');

        new QuizResultsView({
            model: new Model({
                iQuizId: id
            })
        }).render({
                iQuizId: id
            }).inject();
    };

    var QuizUserResultController = function (id, userid) {

        utils.observer.trigger('router:changed');

        new QuizUserResultView().render({
                iQuizId: id,
                iUserId: userid
            }).inject();
    };

    utils.router.route('quiz/:id', DetailController);
    utils.router.route('quiz/:id/start', QuizStartController);
    utils.router.route('quiz/:id/results', QuizResultsController);
    utils.router.route('quiz/:id/result/:userid', QuizUserResultController);
});