define([
    'page/view/page-index'
], function(IndexView){

    var IndexController = function(){

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new IndexView().render({
            sView: 'all'
        }).inject();
    }

    var MyController = function(){

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new IndexView().render({
            sView: 'my',
            iUserID: Backbone.iUserId
        }).inject();
    }

    utils.router.route('pages', IndexController);

    utils.router.route('pages/my/0', MyController);
});
