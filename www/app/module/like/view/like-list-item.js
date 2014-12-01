define([
    'text!like/tpl/like-list-item.html'
], function(text) { 

    return Backbone.View.extend({
        template: _.template(text),
        render: function() {
        	
            this.$el.html(this.template(this.model.toJSON()));
            
            return this;
        }
    });
});

