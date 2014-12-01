define([
    'blog/model/blog',
    'blog/view/blog-edit'
], function (Model, EditView) {

    var EditController = function (id) {

//		utils.history.push();

        utils.observer.trigger('router:changed');

        new EditView({
            model: new Model({
                iBlogId: id
            })
        }).render().inject();
    }

    utils.router.route('blogs/edit/:id', EditController);
});