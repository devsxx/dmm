define([
    'video/model/video',
    'video/view/video-add',
    'video/view/video-edit'
], function(VideoModel, AddView, EditView) {

    function AddController(module, item) {

        utils.observer.trigger('router:changed');

        new AddView({
            model: new VideoModel({})
        }).render({
            iItemId: item,
            sModule: module || 'video'
        }).inject();
    }

    function EditController(id) {

        utils.observer.trigger('router:changed');

        new EditView({
            model: new VideoModel({
                iVideoId: id
            })
        }).render().inject();
    }

    utils.router.route('videos/add(/:module/:item)', AddController);

    utils.router.route('videos/edit/:id', EditController);
});