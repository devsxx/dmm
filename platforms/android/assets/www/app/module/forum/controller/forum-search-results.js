define([
    'forum/view/forum-search-results'
], function(View) {

    function Controller(basecode) {

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        var query = $.parseJSON(atob(basecode));

        new View().render(query).inject();
    }

    utils.router.route('forum_search/:basecode', Controller);
});