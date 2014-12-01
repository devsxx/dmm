define([
    'forum/view/forum-thread-index'
], function(View) {

    function Controller(view) {

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new View().render({
            sView: view
        }).inject();
    }

    utils.router.route('forum_threads/:view', Controller);
});