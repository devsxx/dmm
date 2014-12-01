define([
    'photo/model/photo'
],function(){
    var PhotoModel = require('photo/model/photo')

	var Model = Backbone.Model.extend({
		idAttribute: 'iAlbumId',
		defaults: {
			sModelType: 'photo_album',
			bCanLike: true,
			bCanComment: true
		}
	});
	
	// override model
	Model.prototype.getTitle = function(){
		return this.get('sName') || this.get('sTitle');
	}
	
	// override method from model
	Model.prototype.getPosterTitle = function(){
		return this.get('sUserName');
	}
	
	// override
	Model.prototype.getPosterImageSrc = function(){
		return this.get('sUserImageUrl') || '';
	}
	
	// override
	Model.prototype.getImageSrc = function(){
		return this.get('sAlbumImageURL');
	}
	
	Model.prototype.getPhotoCount = function(){
		return this.get('iTotalPhoto') || 0;
	}
	
	Model.prototype.getPhotoCountText = function(){
		var number = this.getPhotoCount();
        var text = number + (number == 1 ? ' photo' : ' photos');
		return text;
	}

    Model.prototype.getSamplePhotos = function() {
        var aSamplePhotos = this.get('aSamplePhotos')
          , results = []
        
        _.each(aSamplePhotos, function(photo) {
            photo.sModelType = 'photo';
            photo.resizedImageUrl =  constants.siteUrl + '/wideimage/resize.php?src=' + _.escape(photo.sPhotoUrl) + '&w=320&h=177';
            photo.iAlbumId = this.getId();

            var photoModel = new PhotoModel(photo);

            results.push(photoModel);
        }, this);
		
		var limit = utils.setting.get('mfox_limit_photo_to_scroll');
		if (limit > 0) {
			results = results.slice(0, limit);
		}

        return results;
    }

    Model.prototype.canShare = function () {
        this.get('bCanShare') ? true : false;
    }
    
    Model.prototype.getUrl = function () {
        return '#photo-album-detail/' + this.getType() + '/' + this.getId();
    }

    Model.prototype.isProfilePictureAlbum = function () {
        return this.get('bIsProfilePictureAlbum');
    }
	
	return Model;
});
