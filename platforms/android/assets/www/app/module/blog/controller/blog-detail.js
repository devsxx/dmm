define([
    'blog/model/blog',
    'blog/view/blog-detail'
], function (Model, DetailView) {

    var DetailController = function (id) {

		utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iBlogId: id
            })
        }).render().inject();
    }

    utils.router.route('blog/:id', DetailController);
});