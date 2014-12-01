define([
    'marketplace/view/listing-setting',
    'text!marketplace/tpl/listing-item.html'
], function(SettingView, text) {

    return Backbone.ItemView.extend({
        settingView: SettingView,
        className: 'listing-item',
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                sModule: null,
                iItemId: null
            }, context);

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                context: this.context,
                item: this.model
            }));

            return this;
        },
        inject: function(inject) {

            inject(this.$el);

            return this;
        },
        doDeleteConfirm: function(evt, data) {

            var self = this;

            utils.modal.confirm(_t('Are you sure?'), function(selected) {

                if (selected == 1) {

                    utils.observer.trigger('blockui');

                    utils.api.post('marketplace/delete', {
                        iListingId: self.model.getId()
                    }).done(function(data) {
                        if (data.error_code && data.error_code > 0) {
                            return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                        }

                        self.deleteSuccess(data);
                    }).always(function() {
                        utils.observer.trigger('releaseui');
                        utils.popup.close();
                    });
                }
            }, _t('Confirm'), [_t('Delete'), _t('Cancel')]);
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message || _t('Listing successfully deleted.'));

            this.$el.remove();
        }
    });
});