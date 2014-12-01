define(function() {
    var Model = Backbone.Model.extend({
        idAttribute: 'iPhotoId',
        defaults: {
            sModelType: 'photo',
            bCanLike: true,
            bCanShare: true,
            bCanComment: true
        }
    });

    Model.prototype.getType = function() {
        return this.get('sType') || this.get('sModelType');
    }

    Model.prototype.getId = function() {
        return this.id || this.get('iId');
    }

    Model.prototype.getPosterTitle = function() {
        return this.get('sUserName') || '';
    }

    Model.prototype.getPosterImageSrc = function() {
        return this.get('sUserImageUrl') || '';
    }
    Model.prototype.getImgSrc = function() {
        return this.get('sPhotoUrl') || this.get('sPhoto_Url');
    }

    Model.prototype.getModule = function() {
        return this.get('sModule') || null;
    }

    Model.prototype.getItemId = function() {
        return parseInt(this.get('iItemId')) || 0;
    }

    Model.prototype.getUrl = function() {

        var parentType = this.getParentType() || this.getType();
        var url = '#photo-detail/' + parentType + '/' + this.getParentId() + '/' + this.getId();

        if (this.getItemId() && this.getModule() && this.getModule() != this.getType()) {
            return url + '/' + this.getModule() + '/' + this.getItemId();
        }

        return url;
    }

    Model.prototype.getParentId = function() {
        return this.get('iObjectParentId') || this.get('iParentId') || this.get('iAlbumId') || this.get('iEventId') || 0;
    }

    Model.prototype.getUrlWithAlbum = function() {
        return '#photo-detail/' + this.getType() + '/' + this.getAlbumId() + '/' + this.getId();
    }

    Model.prototype.getAlbumId = function() {
        return this.get('iAlbumId') || 0;
    }

    Model.prototype.getResizedImageUrl = function() {
        return this.get('resizedImageUrl');
    }

    Model.prototype.isShowInfo = function() {
        return (this.get('isShowInfo') !== void 0) ? this.get('isShowInfo') : true;
    }

    Model.prototype.getAlbumTitle = function() {
        return this.get('sAlbumName') || this.get('sAlbumTitle');
    }

    Model.prototype.getAlbumType = function() {
        return this.get('sAlbumType') || this.getParentType();
    }

    Model.prototype.getAlbumUrl = function() {
        return '#photo-album-detail/' + this.getAlbumType() + '/' + this.getAlbumId();
    }

    Model.prototype.hasAlbum = function() {
        return (this.getAlbumId() > 0) ? true : false;
    }

    return Model;
});