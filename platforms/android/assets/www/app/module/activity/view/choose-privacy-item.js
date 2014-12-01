define([
    'text!activity/tpl/choose-privacy-item.html'
], function(text) { 
    var PrivacyItem = Backbone.View.extend({
        template: _.template(text),
        initialize: function() {
            this.model.on('change', function() {
                this.render();
            }, this);
        },
        events: {
            'click': 'setChosen'
        },
        setChosen: function() {
            this.model.collection.setChosen(this.model.id);
        },
        render: function() {
            this.$el.html(this.template({
                item: this.model
            }));
            return this;
        }
    });

    return PrivacyItem;
});

