define([
    'poll/model/poll',
    'poll/view/poll-edit'
], function(Model, EditView) {

    var EditController = function(id) {

        utils.observer.trigger('router:changed');

        new EditView({
            model: new Model({
                iPollId: id
            })
        }).render().inject();
    }

    utils.router.route('poll/:id/edit', EditController);
});