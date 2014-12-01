define([
    'text!page/tpl/user-list-popup.html'
], function(text) {

    return Backbone.View.extend({
        events: {},
        region: {
            scroller: '#popup_content',
            holder: '#user_list_holder',
        },
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                type: '',
                items: []
            }, context);

            this.$el.html(this.template(this.context));

            this.$scroller = this.$el.find(this.region.scroller);

            this.$list_holder = this.$el.find(this.region.holder);

            return this;
        },
        inject: function() {

            utils.popup.open(this.$el);

            if (constants.os_version < '30') {
                this.$scroller.ensureSwiper();
            }

            return this;
        }
    });
});