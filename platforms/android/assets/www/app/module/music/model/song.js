define(function() {
    return Backbone.Model.extend({
        idAttribute: 'iSongId',
        defaults: {
            sModelType: 'music_song',
            bCanLike: true
        },
        getSongPath: function() {
            return this.get('sSongPath');
        },
        getOrderNumber: function() {
            return parseInt(this.get('iOrdering'), 10) + 1;
        },
        getAlbumId: function() {
            return parseInt(this.get('iAlbumId')) || 0;
        },
        hasAlbum: function() {
            return this.getAlbumId();
        },
        getAlbumUrl: function() {
            return '#music_album/' + this.getAlbumId();
        },
        getAlbumName: function() {
            return this.get('sAlbumName');
        },
        getPlayCount: function() {
            return this.get('iTotalPlay') || 0;
        },
        getAlbumImageSrc: function() {
            return this.get('sAlbumImage');
        },
        getGenre: function() {
            return this.get('sGenre');
        },
        getTitle: function() {
            return this.get('sTitle');
        },
        getSocialShareUrl: function(){
            return constants.siteUrl + 'index.php?do=/music/'+ this.getId();
        }
    });

});