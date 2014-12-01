define([
    'forum/model/post',
    'forum/view/forum-post-edit'
], function(Model, View) {

    function Controller(id) {

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iPostId: id
            })
        }).render().inject();
    }

    utils.router.route('forum_post/:id/edit', Controller);
});