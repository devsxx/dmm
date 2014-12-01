define([
    'page/model/page',
    'page/view/page-add'
], function(Model, AddPageView) {

    function AddPageController() {

        utils.observer.trigger('router:changed');

        new AddPageView({
            model: new Model({})
        }).render().inject();
    }

    utils.router.route('page/add', AddPageController);
});