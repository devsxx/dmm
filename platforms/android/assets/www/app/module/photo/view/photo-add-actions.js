define([
    'text!photo/tpl/photo-add-actions.html'
], function(text) { 

    var MoreAction = Backbone.View.extend({
        template: _.template(text),
        events: {
            'click .menu-item': 'close'
        },
        render: function(context) {
			
			this.context = $.extend({
				delegateId: ''
			}, context);
			
            this.$el.html(this.template(this.context));

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



