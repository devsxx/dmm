define(function() {

	var Model = Backbone.Model.extend({
		idAttributes : 'iRequestId',
		defaults : {
			sModelType : 'friend_request',
		},
		getPosterId : function() {
			return this.get('iResourceId');
		},

		getPosterType : function() {
			return 'user';
		},

		getPosterImageSrc : function() {
			return this.get('UserProfileImg_Url');
		}
	});
});
