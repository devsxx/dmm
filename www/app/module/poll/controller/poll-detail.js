define([
    'poll/model/poll',
    'poll/view/poll-detail'
], function (Model, DetailView) {

    var DetailController = function (id) {

		utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iPollId: id
            })
        }).render().inject();
    }

    utils.router.route('poll/:id', DetailController);
});