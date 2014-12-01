define([
    'text!video/tpl/video-item.html',
    'text!video/tpl/video-my-item.html',
    'video/view/video-setting'
], function(text, text2, SettingView) {

    return Backbone.ItemView.extend({
        className: 'video-item',
        template: _.template(text),
        templateMy: _.template(text2),
        settingView: SettingView,
        events: {},
        render: function(context) {

            this.context = $.extend({
                sModule: null,
                iItemId: null
            }, context);

            if (!_.isUndefined(this.context.sView) && this.context.sView == 'my') {
                this.template = this.templateMy;
            }

            this.$el.html(this.template({
                context: this.context,
                item: this.model
            }));

            this.$el.attr('id', this.model.getDataId());

            return this;
        },
        inject: function(inject) {
            inject(this.$el);
            return this;
        },
        doDeleteConfirm: function() {

            var self = this;
            var msg = _t('Are you sure to delete this video?');

            utils.popup.close();

            utils.modal.confirm(msg, function(result) {
                if (result == 1) {
                    self.doDelete();
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]); // BUGS https://jira.younetco.com/browse/SEMOBI-1610
        },
        doDelete: function() {
            var self = this;

            this.$el.addClass('hide');

            utils.api.post('video/delete', {
                iVideoId: this.model.getId()
            }).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    self.doDeleteFail(data);
                } else {
                    self.doDeleteSuccess(data);
                }
            }).fail(function() {
                self.doDeleteFail();
            });
        },
        doDeleteFail: function(data) {
            this.$el.removeClass('hide');
            utils.modal.alert(data.error_message || _t('Can not delete this video'));
        },
        doDeleteSuccess: function(data) {
            this.$el.remove();
            utils.modal.toast(data.message);
        }
    });
});