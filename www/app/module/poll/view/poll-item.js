define([
    'poll/view/poll-setting',
    'text!poll/tpl/poll-item.html',
    'text!poll/tpl/poll-my-item.html'
], function(SettingView, text, textMy) {

    return Backbone.ItemView.extend({
        className: 'poll-item',
        settingView: SettingView,
        template: _.template(text),
        render: function(query) {

            this.query = $.extend({
                sView: ''
            }, query);

            if (this.query.sView == 'my') {
                this.template = _.template(textMy);
            }

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function(inject) {

            inject(this.$el);

            return this;
        },
        doDeleteConfirm: function() {

            var self = this;

            utils.modal.confirm(_t('Are you sure that you want to delete this Poll?'), function(selected) {
                if (selected == 1) {
                    utils.observer.trigger('blockui');

                    var postData = {
                        iPollId: self.model.getId()
                    };

                    utils.api.post('poll/delete', postData).done(function(data) {
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

            utils.modal.toast(data.message || _t('Poll successfully deleted.'));

            this.$el.remove();
        }
    });
});