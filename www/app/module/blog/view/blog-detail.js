define([
    'attachment/view/attachment-link-item',
    'attachment/view/attachment-photo-item',
    'blog/view/blog-item',
    'blog/view/blog-topmenu',
    'text!blog/tpl/blog-detail.html',
    'text!blog/tpl/blog-detail-update.html'
], function(AttachmentLinkItemView, AttachmentPhotoItemView, ItemView, TopMenuView, text, textUpdate) {

    return ItemView.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            updateHolder: '#blog_detail_holder',
            activityExtraHolder: '#activity_extra_holder'
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
            this.$updateHolder = this.$el.find(this.region.updateHolder);
            this.$activityExtraHolder = this.$el.find(this.region.activityExtraHolder);
            this.$pageTitle = this.$el.find('#page_title');
            this.$topmenuBtn = this.$el.find('#top_menu_toggle');

            return this;
        },
        inject: function() {

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            utils.helper.addActivityExtraBlock(this.model, this.$activityExtraHolder, this.$scroller);

            return this;
        },
        fetchData: function() {

            var postData = {
                iBlogId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('blog/detail', postData, settings).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {
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

            var self = this;

            this.$pageTitle.html(this.model.getTitle());

            if (this.model.canDislike() || this.model.canEdit() || this.model.canDelete()) {
                this.$topmenuBtn.removeClass('hide');
            }

            this.$updateHolder.html(this.templateUpdate({
                item: this.model
            }));

            this.$attachmentPhotoHolder = this.$el.find('#attachment_photo_holder');
            this.$attachmentLinkHolder = this.$el.find('#attachment_link_holder');

            var injectPhoto = function(dom) {
                self.$attachmentPhotoHolder.append(dom);
            };

            var injectLink = function(dom) {
                self.$attachmentLinkHolder.append(dom);
            };

            _.each(this.model.getAttachmentPhotos(), function(oPhoto) {
                new AttachmentPhotoItemView({
                    model: oPhoto
                }).render().inject(injectPhoto);
            }, this);

            _.each(this.model.getAttachmentLinks(), function(oLink) {
                new AttachmentLinkItemView({
                    model: oLink
                }).render().inject(injectLink);
            }, this);

            if (this.model.isApproved()) {
                this.$activityExtraHolder.removeClass('hide');
            }
        },
        events: {
            'click #top_menu_toggle': 'toggleTopMenu'
        },
        toggleTopMenu: function() {

            this.topMenuIsShown(false);

            utils.topMenu.toggle(this, this.model);
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message || _t('Your blog entry has been deleted'));

            utils.history.back();
        }
    });
});