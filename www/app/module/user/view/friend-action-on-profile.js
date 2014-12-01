define([
    'text!user/tpl/friend-action-on-profile.html'
], function() { 
    var tpl = require('text!user/tpl/friend-action-on-profile.html')

    var FriendAction = Backbone.View.extend({

        initialize: function() {
            utils.observer.on('friend:action-done', this.handleFriendActionDone, this);
        },
        template: _.template(tpl),
        render: function(context) {
			this.context = $.extend({},context);

            this.$el.html(this.template({
                item: this.context.item,
                friendClass: this.getFriendClass(this.context.item)
            }));

            return this;
        },

        getFriendClass: function(item) {
            var isFriend = item.isFriend()
              , isSentRequest = item.isSentRequest()
              , isSentRequestBy = item.isSentRequestBy()
              , isBlocked      = item.get('isBlocked') || false
              ;
			
			if(isBlocked){
				return 'add-friend';
			}else
            if(isFriend) {
                return 'remove-friend';//remove action
            } else {
                if(isSentRequest) {
                    //cancel friend request action
                    return 'cancel-friend-request';
                } else {

                    if(isSentRequestBy) {
                        return 'confirm-friend-request';

                    } else {
                        // add-friend
                        return 'add-friend';
                    }
                }
            }
        },

        handleFriendActionDone: function(result) {
            if(result.iItemId == this.context.item.getId()) {
                this.context.item.set('isFriend', result.isFriend); 
                this.context.item.set('isSentRequest', result.isSentRequest); 
                this.context.item.set('isSentRequestBy', result.isSentRequestBy); 
                this.render(this.context); // bad feeling about this ~.~
            }

        }
    });

    return FriendAction;
});

