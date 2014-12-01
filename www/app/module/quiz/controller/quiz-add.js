define([
    'quiz/model/quiz',
//    'quiz/view/quiz-add'
    'quiz/view/quiz-edit'
], function(Model, AddQuizView) {

    function AddQuizController() {

        utils.observer.trigger('router:changed');

        new AddQuizView({
            model: new Model({})
        }).render({
                sView: 'add'
            }).inject();
    }

    utils.router.route('quizzes/add', AddQuizController);
});