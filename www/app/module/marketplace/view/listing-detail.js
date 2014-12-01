define([
    'marketplace/model/listing-photo',
    'marketplace/view/listing-item',
    'marketplace/view/listing-photo-item',
    'marketplace/view/listing-topmenu',
    'text!marketplace/tpl/listing-detail.html',
    'text!marketplace/tpl/listing-detail-update.html'
], function(ListingPhotoModel, ItemView, AttachmentPhotoItemView, TopMenuView, text, textUpdate) {

    return ItemView.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            update_holder: '#listing_detail_holder',
            activity_extra_holder: '#activity_extra_holder'
        },
        template: _.template(text),
        templateUpdate: _.template(textUpdate),
        topMenuView: TopMenuView,
        render: function() {

            this.$el.attr({
                id: this.model.getDataId()
            });

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $(this.region.holder);
            this.$scroller = this.$el.find(this.region.scroller);
            this.$update_holder = this.$el.find(this.region.update_holder);
            this.$activity_extra_holder = this.$el.find(this.region.activity_extra_holder);
            this.$page_title = this.$el.find('#page_title');
            this.$topmenu_btn = this.$el.find('#top_menu_toggle');

            return this;
        },
        inject: function() {

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            utils.helper.addActivityExtraBlock(this.model, this.$activity_extra_holder, this.$scroller);

            return this;
        },
        fetchData: function() {

            var postData = {
                iListingId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('marketplace/detail', postData, settings).done(this.fetchDataDone).fail(this.fetchDataFail);
        },
        fetchDataDone: function(data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.model.set(data);
            this.updateView();
        },
        fetchDataFail: function() {
            utils.debug.log(arguments);
            utils.history.back();
        },
        updateView: function() {

            this.$page_title.html(this.model.getTitle());

            this.$topmenu_btn.removeClass('hide');

            this.$update_holder.html(this.templateUpdate({
                item: this.model
            }));

            this.$listing_photos_container = this.$el.find('#listing_photos_container');
            this.$listing_photos_holder = this.$el.find('#listing_photos_holder');
            this.$contact_seller_btn = this.$el.find('#contact_seller_btn');

            this.appendPhotos();

            if (!this.model.isPending()) {
                this.$activity_extra_holder.removeClass('hide');
            }
        },
        appendPhotos: function() {

            var self = this;

            var injectPhoto = function(dom) {
                self.$listing_photos_holder.append(dom);
            };

            var aPhoto = this.model.getPhotos().map(function(oPhoto) {
                return new ListingPhotoModel(oPhoto);
            });

            _.each(aPhoto, function(oPhoto) {
                new AttachmentPhotoItemView({
                    model: oPhoto
                }).render().inject(injectPhoto);
            }, this);

            this.$listing_photos_container.swiper({
                mode: 'horizontal',
                slidesPerView: 'auto'
            });
        },
        events: {
            'click #contact_seller_btn': 'contactSeller',
            'click #top_menu_toggle': 'toggleTopMenu'
        },
        contactSeller: function() {

            if (!this.model.canSendMessage()) {
                return utils.modal.alert(_t('Unable to send a private message to this user at the moment.'));
            }

            window.location.href = '#messages/compose/' + this.model.getPosterId();
        },
        toggleTopMenu: function() {

            this.topMenuIsShown(false);

            utils.topMenu.toggle(this, this.model);
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message || _t('Listing successfully deleted.'));

            utils.history.back();
        }
    });
});