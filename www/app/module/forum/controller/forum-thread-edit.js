define([
    'forum/model/thread',
    'forum/view/forum-thread-edit'
], function(Model, View) {

    function Controller(id) {

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iThreadId: id
            })
        }).render().inject();
    }

    utils.router.route('forum_thread/:id/edit', Controller);
});