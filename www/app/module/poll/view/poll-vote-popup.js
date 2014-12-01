define([
    'poll/view/poll-vote-list',
    'text!poll/tpl/poll-vote-popup.html'
], function(ListView, text) {

    return Backbone.View.extend({
        events: {},
        region: {
            scroller: '#popup_content',
            holder: '#poll_vote_list_holder',
        },
        template: _.template(text),
        render: function(query) {

            this.query = $.extend({}, query);

            this.$el.html(this.template());

            this.$scroller = this.$el.find(this.region.scroller);

            this.$list_holder = this.$el.find(this.region.holder);

            return this;
        },
        inject: function() {

            utils.popup.open(this.$el);

            if (constants.os_version < '30') {
                this.$scroller.ensureSwiper();
            }

            this.listView = new ListView({}, this.$list_holder, this.$scroller, {
                loadnew: false,
                loadmore: false
            });

            this.listView.render(this.query).inject();

            return this;
        }
    });
});