define([
    'core',
    'chat/collection/message',
], function(core){
    var MessageCollection = require('chat/collection/message')

	var Model  = Backbone.Model.extend({
        defaults: {
            messages: null,
            'sModelType': 'chat',
            iUnreadMessage: 0
        },
        initialize: function() {
            this.set('messages', new MessageCollection());
            this.set('iUnreadMessage', this.getFromLocalStorage('iUnreadMessage'));
            this.set('iLastMessageTimestamp', this.getFromLocalStorage('iLastMessageTimestamp'));

            this.on('add-new-unread-message', this.handleNewMessageAdded, this);
            this.on('change:iUnreadMessage', this.saveUnreadToLocalStorage, this);
            this.on('change:bIsCurrent', this.handleCurrentChange, this);

        },

        handleCurrentChange: function(model, value) {
            if(value === true) {
                this.set('iUnreadMessage', 0);
            }
        },

        idAttribute: 'iItemId',
        handleNewMessageAdded: function(message) {
            var iUnreadMessage = this.get('iUnreadMessage');
            this.saveToLocalStorage('iLastMessageTimestamp', message.getTimestamp());
            this.set('iUnreadMessage', iUnreadMessage ? iUnreadMessage + 1 : 1);
        },

        saveUnreadToLocalStorage: function(model, value) {
            if(value === 0) {
                this.removeLocalStorage();
            } else { 
                this.saveToLocalStorage('iUnreadMessage', value);
            }
            utils.observer.trigger('chat:update-notification', this.collection);
        },

        removeLocalStorage: function() {
            localStorage.removeItem(this.getKey());
        },

        saveToLocalStorage: function(attr, value) {
            var item = this.getItemFromLocalStorage();
            item[attr] = value;
            localStorage.setItem(this.getKey(), JSON.stringify(item));
        },

        getKey: function() {
            return 'chat-' + this.getType() + '-' + this.getId();
        },

        getItemFromLocalStorage: function() {
            return localStorage.getItem(this.getKey()) ? JSON.parse(localStorage.getItem(this.getKey())) : {}; 
        },

        getFromLocalStorage: function(attr) {
            var item = this.getItemFromLocalStorage();
            return item ? item[attr] : null
        },

        setCurrent: function() {
            _.each(this.collection.models, function(item) {
                item.set('bIsCurrent', false);
            }, this);

            this.set('bIsCurrent', true);
        }
	});
	
	Model.prototype.getId =  function(){
		return this.get('id') || this.get('iItemId');
	}
    
    Model.prototype.isSelf = function () {
        return core.viewer.getId() == this.getId();
    }
	
	Model.prototype.getName = function(){
		return this.get('sFullName');
	}
	
	Model.prototype.getUrl = function(){
		return '#user/' + this.getId();
	}
	
	Model.prototype.getLink = function(){
		return '<a href="'+this.getUrl()+'">'+this.getName()+'</a>';
	}
	
	
	Model.prototype.getImgSrc = function(){
		return this.get('sImage');
	}
	
	Model.prototype.isSentRequestBy = function () {
		return this.get('bSentRequestBy');
	}
	
	Model.prototype.isSentRequest = function () {
		return this.get('bSentRequest');
	}

	Model.prototype.getStatus = function () {
		return this.get('sStatus') || '';
	}
    
	Model.prototype.hasNewMessage = function () {
        return parseInt(this.get('iUnreadMessage'), 10) > 0 ? true : false;
		// return Boolean(this.get('bHasNewMessage'));
	}
	
	Model.prototype.getMessages = function () {
		return this.get('messages');
	}
	
	Model.prototype.getLastTimestamp = function () {
		return this.get('iLastTimestamp') || 0;
	}

	Model.prototype.getDetailUrl = function () {
		return '';
	}

	Model.prototype.getUniqueHtmlIdForChatDetail = function () {
		return ['chat', this.getId()].join('-');
	}

	Model.prototype.getNumberUnreadMesssages = function () {
		return this.get('iUnreadMessage') || 0;
	}

	Model.prototype.isCurrent = function () {
		return this.get('bIsCurrent') || false;
	}

	Model.prototype.getLastMessageTimestamp = function () {
		return this.get('iLastMessageTimestamp') || 0;
	}

	return Model;
});
