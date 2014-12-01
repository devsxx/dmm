define([
    'text!activity/tpl/checkin-location-item.html'
], function() { 
    var tplText = require('text!activity/tpl/checkin-location-item.html');
    
    var CheckinItem = Backbone.View.extend({
        template: _.template(tplText),
        render: function(event) {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return CheckinItem;
});

