define([
    'forum/model/forum',
    'forum/view/forum-detail'
], function(Model, View) {

    function Controller(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iForumId: id
            })
        }).render().inject();
    }

    utils.router.route('forum/:id', Controller);
});