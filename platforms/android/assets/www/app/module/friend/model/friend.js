define(function(core) {
	return Backbone.Model.extend({
		idAttribute : 'id',
		defaults : {
			'sModelType' : 'user'
		},
        isSelf: function () {
            return (this.getId() == Backbone.iUserId);
        },
		getName : function() {
			return this.get('sFullName');
		},
		getTitle : function() {
			return this.get('sFullName');
		},
		getUrl: function(){
			return '#user/' + this.getId();
		},
		getLink: function(){
			return '<a href="'+this.getUrl()+'">'+ this.getTitle() +'</a>';
		},
		getMultualFriendCount : function() {
			return this.get('iMutualFriends') || 0;
		},

		getTextMutualFriend : function() {
			var iNumber = this.get('iMutualFriends');
			//return iNumber + (iNumber == 1 ? " mutual friend" : " mutual friends");
			return " အျပန္အလွန္ သူငယ္ခ်င္း "+ iNumber +" ေယာက္";
		},

		isFriend : function() {
			return this.get('isFriend') || false;
		},

		getImgSrc : function() {
			return this.get('UserProfileImg_Url') || '';
		},

		isSentRequestBy : function() {
			return this.get('bSentRequestBy') || false;
		},

		isSentRequest : function() {
			return this.get('bSentRequest') || false;
		},

		getStatus : function() {
			return this.get('sStatus') || '';
		},

		hasNewMessage : function() {
			return !!this.get('bHasNewMessage');
		}
	});
});
