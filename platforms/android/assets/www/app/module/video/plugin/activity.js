define([
    'video/view/attachment-video'
], function(VideoAttachmentView) {

    utils.headline.add([
        'comment_video',
        'comment_videochannel',
        'comment_ynvideo',
        'ynvideo_comment_video'
    ], function(item) {
        return _t('commented on video %s', item.getItemLink(22));
    });

    utils.headline.add([
        'video',
        'videochannel',
    ], function(item) {
        return _t('shared a video');
    });

    utils.headline.add([
        'video_new',
        'videochannel_new',
        'ynvideo_new'
    ], function(item) {
        return _t('posted new video %s', item.getItemLink(22));
    });

    utils.headline.add([
        'video_add_favorite',
        'videochannel_add_favorite',
        'ynvideo_add_favorite'
    ], function(item) {
        return _t('added video %s to his/her favourite playlist%s', item.getItemLink(22));
    });

    utils.headline.add([
        'video_playlist_new',
        'videochannel_playlist_new',
        'ynvideo_playlist_new'
    ], function(item) {
        return _t('posted a new video playlist', item.getItemLink(22));
    });


    utils.attachment.add(['video', 'ynvideo', 'videochannel'], VideoAttachmentView);

});