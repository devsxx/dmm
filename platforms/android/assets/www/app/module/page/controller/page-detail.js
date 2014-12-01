define([
    'page/model/page',
    'page/view/page-detail-info',
    'page/view/page-detail-activity',
    'page/view/page-detail-blogs',
    'page/view/page-detail-music-albums',
    'page/view/page-detail-music-songs',
    'page/view/page-detail-photo-albums',
    'page/view/page-detail-photos',
    'page/view/page-detail-videos',
    'page/view/page-detail-events'
], function(Model, InfoView, ActivityView, BlogsView, MusicAlbumsView, MusicSongsView, PhotoAlbumsView, PhotosView, VideosView, EventsView) {

    var DetailController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new InfoView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var ActivityController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new ActivityView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var BlogsController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new BlogsView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var MusicAlbumsController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new MusicAlbumsView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var MusicSongsController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new MusicSongsView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var PhotoAlbumsController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new PhotoAlbumsView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var PhotosController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new PhotosView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var VideosController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new VideosView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    var EventsController = function(id) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new EventsView({
            model: new Model({
                iPageId: id
            })
        }).render().inject();
    };

    utils.router.route('pages/:id', DetailController);

    utils.router.route('pages/:id/activity', ActivityController);

    utils.router.route('pages/:id/blogs', BlogsController);

    utils.router.route('pages/:id/music_albums', MusicAlbumsController);

    utils.router.route('pages/:id/music_songs', MusicSongsController);

    utils.router.route('pages/:id/photo_albums', PhotoAlbumsController);

    utils.router.route('pages/:id/photos', PhotosController);

    utils.router.route('pages/:id/videos', VideosController);

    utils.router.route('pages/:id/events', EventsController);
});