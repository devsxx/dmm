define([
	'friend/model/friend'
],function(FriendModel)
{
	return Backbone.Collection.extend({
		model: FriendModel
	});
});
