define(function(){
	
	var Model = Backbone.Model.extend({
		
	});
	
	Model.prototype.getId =  function(){
		return this.get('iConversationId');
	}
	
	Model.prototype.getUrl =  function(){
        return '#message/' + this.getId();
	}
	
	Model.prototype.getTitle =  function(){
		return this.get('sTitle');
	}
	
	Model.prototype.getDescription = function(){
		return this.get('sBody').replace(/\[img\][^\[]+\[\/img\]/gi, '');
	}
	
	Model.prototype.getPosterTitle =  function(){
		return this.get('sOwnerFullName');
	}
	
	Model.prototype.getPosterImageSrc = function(){
		return this.get('sOwnerImage');
	}
	
	Model.prototype.getPosterId = function(){
		return this.get('iOwnerId');
	}
	
	Model.prototype.getPosterUrl =  function(){
		return '#user/' + this.getPosterId();
	}
	
	Model.prototype.getPosterLink = function(){
		return '<a href="'+this.getPosterUrl()+'">'+this.getPosterTitle()+'</a>';
	}
	
	Model.prototype.isRead = function () {
		return false !== this.get('bIsRead');
	}

    Model.prototype.getPostedDate = function(){
        return this.get('sTimeConverted');
    }
    
    Model.prototype.getFolder = function () {
        return this.get('sNameOfFolder');
    }
    
    Model.prototype.isReply = function () {
        return this.get('bIsReply') ? true : false;
    }
    
    Model.prototype.getRecipients = function () {
        return this.get('aRecipients');
    }
	
	return Model;
});
