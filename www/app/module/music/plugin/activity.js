define([
    'music/view/attachment-music-playlist'
], function(PlaylistAttachmentView) {

    utils.headline.add(['music_playlist_new'], function(item) {
        return _t('created a new playlist %s', item.getItemLink());
    });

    utils.headline.add(['music_song', 'music_album'], function(item) {
        return _t('shared a song');
    });

    utils.attachment.add(['music_playlist', 'music_song', 'music_album', 'music'], PlaylistAttachmentView);
});