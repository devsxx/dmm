define([
    'blog/view/blog-setting',
    'text!blog/tpl/blog-item.html',
    'text!blog/tpl/blog-my-item.html'
], function(SettingView, text, textMy) {

    return Backbone.ItemView.extend({
        settingView: SettingView,
        className: 'blog-item',
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                sModule: null,
                iItemId: null
            }, context);

            if (this.context.sView == 'my') {
                this.template = _.template(textMy);
            }

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

            utils.modal.confirm(_t('Are you sure you want to delete this blog entry?'), function(selected) {

                if (selected == 1) {
                    utils.observer.trigger('blockui');

                    utils.api.post('blog/delete', {
                        iBlogId: self.model.getId()
                    })
                        .done(function(data) {

                            if (data.error_code && data.error_code > 0) {
                                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                            }

                            // success
                            self.deleteSuccess(data);
                        })
                        .always(function() {

                            utils.observer.trigger('releaseui');

                            utils.popup.close();
                        });
                }
            }, _t('Confirm'), [_t('Delete'), _t('Cancel')]);
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message || _t('Your blog entry has been deleted'));

            this.$el.remove();
        }
    });
});