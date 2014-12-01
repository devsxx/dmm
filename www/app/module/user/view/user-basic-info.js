define([
    'text!user/tpl/user-basic-info.html',
    'user/view/friend-action-on-profile',
], function(text, FriendActionView ) { 
	
	return Backbone.View.extend({
        template: _.template(text),
        region:{
            wrapper: '#basic-info-holder',
        },
        initialize: function(){
        	var self = this;
        	this.model.on('change',function(){
        		self.updateView();
        	});
        },
        render: function() {
        	
        	this.$el.html(this.template({
                item: this.model
            }));

            this.$friendAction = $('#friend-action-holder', this.$el);

            if(!this.model.isOwner()) {//owner should not have friend action on his own profile
                this.$friendAction.html(new FriendActionView().render({
                    item: this.model
                }).el);
            }
            return this;
        },
        inject: function() {
            $(this.region.wrapper) .html(this.$el);
            return this;
        },
        updateView: function(){
        	if(!this.model.isOwner()) {//owner should not have friend action on his own profile
                this.$friendAction.html(new FriendActionView().render({
                    item: this.model
                }).el);
            }
        }

    });
});

