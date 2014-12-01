define([
    'attachment/view/attachment-link-item',
    'attachment/view/attachment-photo-item',
    'forum/view/forum-post-setting',
    'text!forum/tpl/forum-post-item-search.html',
    'text!forum/tpl/forum-post-item.html'
], function(AttachmentLinkItemView, AttachmentPhotoItemView, SettingView, textSearch, text) {

    return Backbone.ItemView.extend({
        className: 'forum-post-item',
        template: _.template(text),
        settingView: SettingView,
        events: {
            'quote': 'onQuoteClick'
        },
        render: function(query) {

            this.query = $.extend({
                isSearch: false,
                thread: null
            }, query);

            if (this.query.isSearch) {
                this.template = _.template(textSearch);
            }

            this.$el.attr("id", this.model.getDataId());

            this.$el.html(this.template({
                item: this.model,
                thread: this.query.thread
            }));

            return this;
        },
        inject: function(inject) {

            inject(this.el);

            if (this.model.hasAttachments()) {
                this.appendAttachments();
            }
        },
        appendAttachments: function() {

            var self = this;

            this.$attachment_photo_holder = this.$el.find('#attachment_photo_holder');
            this.$attachment_link_holder = this.$el.find('#attachment_link_holder');

            var injectPhoto = function(dom) {
                self.$attachment_photo_holder.append(dom);
            };

            var injectLink = function(dom) {
                self.$attachment_link_holder.append(dom);
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
        },
        doDeleteConfirm: function() {

            var self = this;

            utils.modal.confirm("Do you want to delete this post?", function(selected) {
                if (selected == 1) {
                    utils.observer.trigger('blockui');

                    var postData = {
                        iPostId: self.model.getId()
                    };

                    utils.api.post('forum/postdelete', postData).done(function(data) {
                        if (data.error_code && data.error_code > 0) {
                            return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                        }

                        self.deleteSuccess(data);
                    }).always(function() {
                        utils.observer.trigger('releaseui');
                        utils.popup.close();
                    });
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message);

            this.$el.remove();
        },
        onSettingClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('setting')) {
                return false;
            }

            evt.preventDefault();

            this.getSettingView().render(this.query).inject();
        },
        onQuoteClick: function() {

            if (this.query.thread.isClosed()) {
                return utils.modal.alert(_t('Thread is closed.'));
            }

            window.location.href = '#forum_thread/' + this.model.getThreadId() + '/reply/' + this.model.getId();
        }
    });
});