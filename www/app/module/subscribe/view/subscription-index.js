define([
    'text!subscribe/tpl/subscription-index.html',
    'subscribe/view/subscription-list'
],function(text, ListView){

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function(){

        },
        render: function(){

            this.$el.html(this.template());

            return this;
        },
        inject: function(params){

            var $holder = $(this.region.holder).html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.listView  = new ListView({},
                this.$el.find('#subscription_list_holder'),
                this.$scroller,
                {
                    loadmore: false,
                    loadnew: false
                });


            // render list view
            this.listView.render().inject();

            return this;
        }
    });
});

