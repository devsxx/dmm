define([
	'core'
],function(core) {
	return Backbone.Model.extend({
		idAttribute : 'iAlbumId',
		defaults : {
			sModelType : 'music_album',
			bCanPostComment : 1,
			bCanLike : true,
			bCanShare : true
		},
		getTitle : function() {
			return this.get('sName');
		},
		getAlbumName : function() {
			return this.get('sAlbumName');
		},
		getLink : function() {
			return '<a href="' + this.getUrl() + '">' + this.getTitle() + '</a>';
		},
		getImageSrc : function() {
			return this.get('sImagePath');
		},
		getTrackCount : function() {
			return this.get('iTotalTrack') || 0;
		},
		getPlayCount : function() {
			return this.get('iTotalPlay') || 0;
		},
		getDescription : function() {
			return this.get('sDescription') || '';
		},
		isOwner: function(){
	        return core.viewer.getId() == this.getPosterId();
	    },
	    
        getSocialShareUrl: function(){
            return constants.siteUrl + 'index.php?do=/music/album/'+ this.getId();
        }
	});
});
