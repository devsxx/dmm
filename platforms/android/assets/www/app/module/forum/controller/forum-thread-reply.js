define([
    'forum/model/thread',
    'forum/view/forum-thread-reply'
], function(Model, View) {

    function Controller(id, postid) {

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iThreadId: id
            })
        }).render({
            iPostId: postid
        }).inject();
    }

    utils.router.route('forum_thread/:id/reply(/:postid)', Controller);
});