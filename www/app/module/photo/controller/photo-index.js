define([
    'core',
    'photo/view/photo-index',
    'photo/view/photo-details'
], function(core, IndexView, DetailView) {

    function IndexController() {

        utils.history.push(true);

        utils.observer.trigger('router:changed');

        new IndexView().render({}).inject();
    }

    function FriendPhotoController(type, id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new IndexView().render({
            type: type,
            iUserId: id
        }).inject();
    }

    function DetailController(type, iParentId, id, module, item) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView().render({
            iPhotoId: id,
            iParentId: iParentId,
            sType: type,
            iItemId: item,
            sModule: module
        }).inject();
    }

    function PhotoDetailController(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView().render({
            iPhotoId: id,
            iParentId: Backbone.iUserId,
            sType: 'user',
            iItemId: null,
            sModule: null
        }).inject();
    }

    function AdvancedPhotoDetailController(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView().render({
            iPhotoId: id,
            iParentId: Backbone.iUserId,
            sType: 'user',
            iItemId: null,
            sModule: null
        }).inject();
    }

    utils.router.route('photos', IndexController);

    utils.router.route('photos-of/:type/:id(/:act)', FriendPhotoController);

    utils.router.route('photo-detail/:type/:parentid/:id(/:module/:item)', DetailController);
    utils.router.route('photo/:id', PhotoDetailController);
    utils.router.route('advancedphoto/:id', AdvancedPhotoDetailController);
});