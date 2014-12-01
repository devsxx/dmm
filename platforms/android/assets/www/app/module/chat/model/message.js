define([
    'core'
], function(core){
	var Model  = Backbone.Model.extend({
        idAttribute: 'iMessageId',
        defaults: {
            'sModelType': 'message'
        }
	});
	
    Model.prototype.getMessages = function() {
        return this.get('aMessages') || (this.get('sMessage') ? [[this.get('sMessage')]] : []);
    }

    Model.prototype.getSMessage = function() {
        return this.get('sMessage') || '';
    }
	
    Model.prototype.getSenderImgSrc = function() {
        return this.get('sSenderImage') || '';
    }

    Model.prototype.getSenderId = function() {
        return this.get('iSenderId') || '';
    }

    Model.prototype.getSenderUrl = function() {
        return '#user/' + this.getSenderId();
    }

    Model.prototype.getRecentUpdatedTimestamp = function() {
        return this.get('iRecentUpdatedTimestamp') || this.getTimestamp() || '';
    }

    Model.prototype.getSendStatusClass = function() {
        var sClass = '';
        if(this.get('sSendStatusType') == 'error') sClass = 'message-status-error';
        return sClass;
    }

    // Model.prototype.isOwner = function() {
    //     console.log('senderid', this.get('iSenderId'));
    //     console.log('senderid', Backbone.iUserId);
    //     return Backbone.iUserId == this.get('iSenderId')
    // }

    Model.prototype.getTimeString = function() {
        return  (this.getTimestamp()) ? utils.moment(this.getTimestamp() * 1e3).format('MM/DD/YY h:mmA') : '';
        
    }

    Model.prototype.getSendStatus = function() {
        if(this.get('sSendStatus')) { 
            return this.get('sSendStatus')  == 'done' ? '' : this.get('sSendStatus');
        } else {
            return '';
        }
    }
	return Model;
});

