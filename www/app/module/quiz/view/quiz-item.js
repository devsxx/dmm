define([
    'text!quiz/tpl/quiz-item.html'
], function (text) {

    return Backbone.ItemView.extend({
        className: 'quiz-item',
        template: _.template(text),
        render: function () {

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

            utils.modal.confirm(_t("Are you sure that you want to delete this Quiz?"), function (selected) {
                if (selected == 1) {
                    utils.observer.trigger('blockui');

                    utils.api.post('quiz/delete', {iQuizId: self.model.getId()})
                        .done(function(data){
                            if (data.error_code && data.error_code > 0) {
                                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                            }

                            // success
                            self.deleteSuccess(data);
                        })
                        .always(function () {
                            utils.observer.trigger('releaseui');
                            utils.popup.close();
                        });
                }
            }, _t('Confirm'), [_t('Delete'),_t('Cancel')]);
        }
    });
});