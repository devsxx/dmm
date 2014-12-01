define([
    'core',
    'text!photo/tpl/photo-index.html',
    'photo/view/photo-list',
    'photo/view/photo-search',
    'photo/view/photo-more-menu'
], function(core, text) {

    var ListView = require('photo/view/photo-list'),
        SearchView = require('photo/view/photo-search'),
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

            this.$el.html(this.template({ //do NOT mix query and template param
                iUserId: query.iUserId || null,
                iViewerId: core.viewer.getId(),
            }));

            return this;

        },
        inject: function() {

            var $holder = $(this.region.holder).html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable
            // render search iew

            this.listView = new ListView({},
                this.$el.find('#photo_list_view_holder'),
                this.$scroller, {
                    loadmore: true,
                    loadnew: false,
                    iParentId: 0,
                    iAlbumId: 0
                });

            this.searchView = new SearchView();

            this.searchView.render().inject();

            // render list view
            this.listView.render(this.query).inject();

            var self = this;

            this.searchView.on('submit', function(data) {
                self.listView.resetQuery(data);
            });

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