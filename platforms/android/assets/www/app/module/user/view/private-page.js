define([
    'text!user/tpl/private-page.html'
], function(text) { 
    return Backbone.View.extend({
        template: _.template(text),
        region: {
            main: '#user-profile-info'
        },
        render: function() {
        	this.$holder =  $(this.region.holder);
            return this;
        },
        inject: function() {
			
			this.$holder.html(this.$el);
			
			return this;
        }
    });
});

