define([
    'page/model/page',
    'page/view/page-invite'
], function(Model, PageInviteView){

    function PageInviteController(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new PageInviteView({
            model: new Model({iPageId: id})
        }).render().inject();
    }

    utils.router.route('pages/invite/:id', PageInviteController);
});