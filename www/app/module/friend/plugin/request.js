define([
	'friend/view/request/friend-request'
],function(FriendRequest){
	
	utils.requestProxy.add(['friend_request'], FriendRequest);
});
