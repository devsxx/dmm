define([
    'quiz/model/quiz',
    'quiz/view/quiz-edit'
], function(Model, EditQuizView) {

    function EditQuizController(id) {

        utils.observer.trigger('router:changed');

        new EditQuizView({
            model: new Model({
                iQuizId: id
            })
        }).render({
                sView: 'edit'
            }).inject();
    }

    utils.router.route('quizzes/edit/:id', EditQuizController);
});