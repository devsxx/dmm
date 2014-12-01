define([
    'poll/view/poll-add'
], function (AddView) {

    var AddController = function () {

//		utils.history.push();

        utils.observer.trigger('router:changed');

        new AddView().render().inject();
    }

    utils.router.route('polls/add', AddController);
});