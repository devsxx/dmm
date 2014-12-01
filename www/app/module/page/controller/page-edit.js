define([
    'page/model/page',
    'page/view/page-edit'
], function(Model, EditPageView) {

    function EditPageController(id) {

        utils.observer.trigger('router:changed');

        new EditPageView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    }

    utils.router.route('pages/edit/:id', EditPageController);
});