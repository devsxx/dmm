define([
    'text!photo/tpl/album-item-setting.html'
], function() { 
    var text = require('text!photo/tpl/album-item-setting.html')

    var SettingView = Backbone.View.extend({
        template: _.template(text),
        render: function() {
            this.$el.html(this.template({item: this.model}));
            return this;
        },

        inject: function() {
            utils.popup.open(this.$el);
            return this;
        }
    });

    return SettingView;
});

