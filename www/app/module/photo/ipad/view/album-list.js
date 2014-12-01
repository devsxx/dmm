define([
    'photo/view/album-item',
    'photo/view/album-my-item',
], function() {
    var AlbumItem = require('photo/view/album-item')
      , AlbumMyItem = require('photo/view/album-my-item')


    return {
        init: function(params) {

            if(document.URL.match('user-album')) {
                this.itemView = AlbumMyItem;
            } else { 
                this.itemView = AlbumItem;
            }
        }

    };
});
