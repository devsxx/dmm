define([
    'text!page/tpl/page-item.html',
    'text!page/tpl/page-item-my.html',
    'page/view/page-setting'
], function (text, textMy, SettingView) {

    return Backbone.ItemView.extend({
        settingView: SettingView,
        className: 'page-item',
        template: _.template(text),
        events: {},
        render: function (context) {

            this.context = $.extend({}, context);

            // replace my item html that has the setting icon
            if (this.context.sView == 'my') {
                this.template = _.template(textMy)
            }

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function (inject) {

            inject(this.$el);

            return this;
        },
        doDeleteConfirm: function (evt, data) {

            var self = this;

            utils.modal.confirm(_t('Are you sure you want to delete this page?'), function (selected) {

                if (selected == 1) {

                    utils.popup.close();

                    utils.observer.trigger('blockui');

                    utils.api.post('pages/delete', {iPageId: self.model.getId()})
                        .done(function(data){

                            if (data.error_code && data.error_code > 0) {
                                return utils.model.alert(data.error_message || _t('Can not load data from server'))
                            }

                            self.deleteSuccess(data);
                        })
                        .always(function () {

                            utils.observer.trigger('releaseui');

                        });
                }
            }, _t('Confirm'), [_t('Delete'), _t('Cancel')]);
        },
        deleteSuccess: function (data) {

            utils.modal.toast(data.message || _t('Your page has been deleted'));

            this.$el.remove();
        }
    });
});