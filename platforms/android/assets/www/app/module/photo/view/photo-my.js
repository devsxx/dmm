define([
    'core',
    'text!photo/tpl/photo-my.html',
    'photo/view/photo-my-list',
    'photo/view/photo-more-menu'
], function(core, text) {

    var ListView = require('photo/view/photo-my-list'),
        MoreMenuView = require('photo/view/photo-more-menu');

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function() {

        },
        render: function(query) {

            this.query = $.extend({
                type: 'user',
                iUserId: 0
            }, query);

            this.$el.html(this.template(this.query));

            return this;

        },
        inject: function() {

            var $holder = $(this.region.holder).html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.listView = new ListView({},
                this.$el.find('#photo_list_view_holder'),
                this.$scroller, {
                    loadmore: true,
                    loadnew: false,
                    iParentId: 0,
                    iAlbumId: 0
                });

            // render list view
            this.listView.render(this.query).inject();

            return this;
        },
        events: {
            'click #footer_more_btn': 'showMoreMenu'
        },
        showMoreMenu: function(evt) {
            this.moreMenu = new MoreMenuView();
            this.moreMenu.render().inject();
        }
    });
});