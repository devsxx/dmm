define([
    'activity/view/activity-detail',
    'activity/model/feed'
], function(DetailView, FeedModel) {

    function ActivityDetailRouter(id, action, parentId) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new FeedModel({
                iActionId: id,
                parentModuleId: parentId ? parentId : ''
            })
        }).render().inject();
    }

    utils.router.route('feed/:id(/:action)(/:parentId)', ActivityDetailRouter);

    utils.router.route('user_status/:id', ActivityDetailRouter);
});