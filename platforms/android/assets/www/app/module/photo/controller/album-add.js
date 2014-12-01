define([
    'photo/model/album',
    'photo/view/album-add-index'
], function(Model, View) {

    /*
     *   Controller is called when user selects create a new album.
     */
    function AddController(module, item) {

        // utils.history.push();

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iAlbumId: 0
            })
        }).render({
            typeForm: 'create',
            iItemId: item,
            sModule: module || 'photo'
        }).inject();
    }

    /*
     *   Controller is called when user selects edit his/her album.
     */
    function EditController(id) {

        // utils.history.push();

        utils.observer.trigger('router:changed');

        new View({
            model: new Model({
                iAlbumId: id
            })
        }).render({
            typeForm: 'edit'
        }).inject();
    }

    utils.router.route('photos/add-album(/:module/:item)', AddController);

    utils.router.route('photos/edit-album/:id', EditController);
});