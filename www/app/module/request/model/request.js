define(function(){
	
	var Model = Backbone.Model.extend({
		idAttribute: 'iRequestId',
		defaults: {
			sModelType: 'request',
			sRequestType: 'friend_request'
		}
	});
	
	Model.prototype.getPosterId =  function(){
		return this.get('iResourceId');
	}
	
	Model.prototype.getPosterType =  function(){
		return 'user';
	}
	
	Model.prototype.getPosterImageSrc =  function(){
		return this.get('UserProfileImg_Url');
	}
	
	Model.prototype.getRequestType = function(){
		return this.get('sRequestType') ||'';
	}
	
	return Model;
});
