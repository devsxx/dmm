define([
    'forum/model/thread',
    'forum/view/forum-thread-detail'
], function(Model, View) {

    function Controller(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iThreadId: id
            })
        }).render().inject();
    }

    utils.router.route('forum_thread/:id', Controller);
});