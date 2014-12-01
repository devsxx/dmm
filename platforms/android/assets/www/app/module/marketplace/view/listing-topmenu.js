define([
    'text!marketplace/tpl/listing-topmenu.html'
], function(text) {
    return Backbone.TopMenuView.extend({
        template: _.template(text),
        render: function() {

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function() {

            utils.popup.open(this.$el);

            return this;
        },
        hide: function() {

            utils.popup.close();

            return this;
        }
    });
});