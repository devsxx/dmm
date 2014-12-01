define([
    'utils',
    'photo/model/album',
    'photo/view/album-detail-index'
], function(utils, Model, DetailView) {

    function DetailController(type, id, act) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iAlbumId: id,
                sModelType: type
            })
        }).render({
            iAlbumId: id
        }).inject();
    }

    function PhotoAlbumDetailController(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iAlbumId: id,
                sModelType: 'photo_album'
            })
        }).render({
            iAlbumId: id
        }).inject();
    }

    function AdvancedPhotoAlbumDetailController(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new DetailView({
            model: new Model({
                iAlbumId: id,
                sModelType: 'advancedphoto_album'
            })
        }).render({
            iAlbumId: id
        }).inject();
    }

    utils.router.route('photo-album-detail/:type/:id(/:act)', DetailController);
    utils.router.route('photo_album/:id', PhotoAlbumDetailController);
    utils.router.route('advancedphoto_album/:id', AdvancedPhotoAlbumDetailController);
});