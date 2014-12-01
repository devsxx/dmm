define([
    'utils',
    'text!photo/tpl/album-detail-index.html',
    'text!photo/tpl/album-detail-photos.html',
    'text!photo/tpl/album-add-action-bar.html',
    'photo/view/album-list',
    'photo/view/album-detail-menu',
    'photo/view/album-my-item',
    'photo/collection/photo'
], function(utils, text, text2, barTpl) {


    var PhotoCollection = require('photo/collection/photo'),
        TopMenuView = require('photo/view/album-detail-menu'),
        ItemView = require('photo/view/album-my-item');

    return ItemView.extend({
        region: {
            main: '#main',
            content: '#content',
            barTplId: '#album-action-bar'
        },
        className: 'album-detail-index',
        template: _.template(text),
        events: {
            'click #top_menu_toggle': 'toggleTopMenu'
        },
        topMenuView: TopMenuView,
        initialize: function() {
            this.photos = new PhotoCollection();
            Backbone.DetailView.prototype.initialize.apply(this, arguments);
        },
        render: function(context) {

            this.context = $.extend({
                iAlbumId: 0,
                iAmountOfPhoto: 500,
                iInDetails: 1
            }, context);

            this.$el.html(this.template(this.context));

            this.$el.attr('id', this.model.getDataId());

            this.$scroller = this.$el.find(this.region.content);
            this.$pageTitle = this.$el.find('#album_title');
            this.topMenuToggleBtn = this.$el.find('#top_menu_toggle');
            this.$actionBarHodler = this.$el.find('#album_action_bar_holder');
            this.$photoListHolder = this.$el.find('#photo_list_holder');
            this.$activityExtraHolder = this.$el.find('#activity_extra_holder');

            this.fetchData();

            return this;

        },
        toggleTopMenu: function() {

            utils.topMenu.toggle(this, this.model);
        },
        inject: function() {

            $(this.region.main).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            return this;
        },
        fetchData: function() {
            var self = this;

            // Get album detail info
            var $ajax1 = utils.api.get('photo/albumview', {
                iAlbumId: this.context.iAlbumId
            }).done(function(data) {
                self.model.set(data);
            }).fail(function() {
                utils.debug.log(arguments);
            });

            var $ajax2 = utils.api.get('photo/listalbumphoto', this.context).done(function(data) {
                var photos = data.map(function(item) {
                    return $.extend({
                        iAlbumId: self.context.iAlbumId
                    }, item);
                });
                self.photos.add(photos);
                // self.update(data);
            }).fail(function() {
                utils.debug.log(arguments);
            });

            $.when($ajax1, $ajax2).done(function() {
                if (self.model.get('bCanView') == 1) {
                    self.updateView();
                } else {
                    self.$pageTitle.html(_t('Private Page'));
                    $(self.region.content).html("<div class='not-found'>You don't have permission to view this album</div>");
                }

            }).fail(function() {

            });

        },
        updateView: function() {

            var self = this;

            // change page header into album name
            this.$pageTitle.html(this.model.getTitle());

            if (this.model.canEdit() || this.model.canDelete()) {
                this.topMenuToggleBtn.removeClass('hide');
            }

            this.$actionBarHodler.html(_.template(require('text!photo/tpl/album-add-action-bar.html'))({
                item: this.model
            }));

            this.$photoListHolder.html(_.template(require('text!photo/tpl/album-detail-photos.html'))({
                items: this.photos
            }));

            this.$activityExtraHolder.removeClass('hide');

            utils.helper.addActivityExtraBlock(this.model, this.$activityExtraHolder, this.$scroller);
        },
        deleteSuccess: function(data) {
            utils.modal.toast(_t("The album has been deleted successfully."));
            window.location = '#albums';
        }
    });
});