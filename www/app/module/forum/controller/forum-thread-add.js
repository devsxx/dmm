define([
    'forum/view/forum-thread-add'
], function(View) {

    function Controller(id) {

        utils.observer.trigger('router:changed');

        new View().render({
            iForumId: id
        }).inject();
    }

    utils.router.route('forum/:id/add_thread', Controller);
});