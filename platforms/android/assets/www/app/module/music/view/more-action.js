define([
    'text!music/tpl/action-more.html'
], function(text) { 

    var MoreAction = Backbone.View.extend({
        template: _.template(text),
        events: {
            'click .setting-item': 'close'
        },
        render: function() {
            this.$el.html(this.template());

            return this;
        },

        inject: function() { 
            
            utils.popup.open(this.$el);
			
			return this;
        },
        
        close: function() {
		    utils.popup.close();	
			
			return this;
        },
    });

    return MoreAction;
});

