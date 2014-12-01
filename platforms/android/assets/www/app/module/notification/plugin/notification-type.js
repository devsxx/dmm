define(function() {

    function NotificationType() {
        this.maps = {};

        this.add = function(types, cb) {
            for (var i = 0; i < types.length; ++i) {
                this.maps[types[i]] = cb;
            }
            return this;
        }

        this.getItemDetailUrl = function(obj) {
            var type = obj.get('sTypeId');
            if (this.maps.hasOwnProperty(type)) {
                return this.maps[type](obj);
            }
            return '#none';
        }
    }

    var notificationType = new NotificationType();

    notificationType.add([
        'comment_advancedphoto_tag',
        'comment_event',
        'comment_event_tag',
        'comment_feed_tag',
        'comment_fevent',
        'comment_fevent_tag',
        'comment_user_statustag',
        'comment_videochannel_tag',
        'event_approved',
        'event_comment',
        'event_comment_feed',
        'feed_comment_like',
        'feed_comment_link',
        'fevent_approved',
        'fevent_comment',
        'fevent_comment_feed',
        'fevent_repeattonormalwarning',
        'photo_approved',
        'photo_tag',
        'videochannel_favourite'
    ], function(obj) {
        return '#none';
    });

    notificationType.add([
        'comment_advancedphoto',
        'advancedphoto_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iPhotoId) {
            return '#none';
        }
        return '#photo-detail/advancedphoto/0/' + obj.get('aLink').iPhotoId;
    });

    notificationType.add([
        'comment_photo',
        'photo_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iPhotoId) {
            return '#none';
        }
        return '#photo-detail/photo/0/' + obj.get('aLink').iPhotoId;
    });

    notificationType.add([
        'event_comment_like',
        'event_like',
        'event_invite'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#event-detail/event/' + obj.get('iItemId');
    });

    notificationType.add([
        'fevent_invite'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#event-detail/fevent/' + obj.get('iItemId');
    });

    notificationType.add([
        'fevent_comment_like',
        'fevent_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iEventId) {
            return '#none';
        }
        return '#event-detail/fevent/' + obj.get('aLink').iEventId;
    });

    notificationType.add([
        'comment_feed',
        'comment_user_status',
        'feed_comment_profile',
        'user_status_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iFeedId) {
            return '#none';
        }
        return '#feed/' + obj.get('aLink').iFeedId;
    });

    notificationType.add([
        'friend_accept',
        'friend_accepted'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iUserId) {
            return '#none';
        }
        return '#user/' + obj.get('aLink').iUserId;
    });

    notificationType.add([
        'comment_music_album',
        'music_album_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iAlbumId) {
            return '#none';
        }
        return '#music_album/' + obj.get('aLink').iAlbumId;
    });

    notificationType.add([
        'comment_music_song',
        'music_song_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iSongId) {
            return '#none';
        }
        return '#music_song/' + obj.get('aLink').iSongId;
    });

    notificationType.add([
        'comment_photo_album',
        'photo_album_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iAlbumId) {
            return '#none';
        }
        return '#photo-album-detail/photo_album/' + obj.get('aLink').iAlbumId;
    });

    notificationType.add([
        'comment_advancedphoto_album',
        'advancedphoto_album_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iAlbumId) {
            return '#none';
        }
        return '#photo-album-detail/advancedphoto_album/' + obj.get('aLink').iAlbumId;
    });

    notificationType.add([
        'comment_video',
        'video_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iVideoId) {
            return '#none';
        }
        return '#video/' + obj.get('aLink').iVideoId;
    });

    notificationType.add([
        'videochannel_like'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iVideoId) {
            return '#none';
        }
        return '#videochannel/' + obj.get('aLink').iVideoId;
    });

    notificationType.add([
        'comment_videochannel',
        'videochannel'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#videochannel/' + obj.get('iItemId');
    });

    notificationType.add([
        'pages_approved'
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').iPageId) {
            return '#none';
        }
        return '#pages/' + obj.get('aLink').iPageId;
    });

    notificationType.add([
        'pages_invite'
    ], function(obj) {
        if (!obj.get('iItemId') && (!obj.get('aLink') || !obj.get('aLink').iPageId)) {
            return '#none';
        }
        return '#pages/' + (obj.get('iItemId') || obj.get('aLink').iPageId);
    });

    notificationType.add([
        'blog_approved',
        'blog_like',
        'comment_blog'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#blog/' + obj.get('iItemId');
    });

    notificationType.add([
        'comment_poll',
        'poll',
        'poll_approved',
        'poll_like'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#poll/' + obj.get('iItemId');
    });

    notificationType.add([
        'comment_quiz',
        'quiz',
        'quiz_like'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#quiz/' + obj.get('iItemId');
    });

    notificationType.add([
        'forum_post_like',
        'forum_subscribed_post',
        'forum_thread_approved'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#forum_thread/' + obj.get('iItemId');
    });

    notificationType.add([
        'advancedmarketplace_approved',
        'advancedmarketplace_invite',
        'advancedmarketplace_like',
        'comment_advancedmarketplace'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#advancedmarketplace/' + obj.get('iItemId');
    });

    notificationType.add([
        'marketplace_approved',
        'comment_marketplace',
        'marketplace_invite',
        'marketplace_like'
    ], function(obj) {
        if (!obj.get('iItemId')) {
            return '#none';
        }
        return '#marketplace/' + obj.get('iItemId');
    });

    notificationType.add([
        'feed_mini_like' // like a comment
    ], function(obj) {
        if (!obj.get('aLink') || !obj.get('aLink').sCommentType) {
            return '#none';
        }

        var pattern = /i.*Id/;
        var iItemId = utils.helper.getObjPropByPatt(obj.get('aLink'), pattern);

        if (!iItemId) {
            return '#none';
        }

        return '#' + obj.get('aLink').sCommentType + '/' + iItemId;
    });

    return notificationType;
});