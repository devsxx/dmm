define([
    'text!quiz/tpl/quiz-my-item.html',
    'quiz/view/quiz-setting'
], function (text, SettingView) {

    return Backbone.ItemView.extend({
        className: 'quiz-item',
        template: _.template(text),
        settingView: SettingView,
        render: function () {

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                item: this.model
            }));
            
            this.$closedIcon = this.$el.find('.icon-quiz-lock');

            return this;
        },
        inject: function (inject) {

            inject(this.$el);

            return this;
        },
        events: {
            'open': 'openPoll',
            'close': 'closePoll'
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
        },
        deleteSuccess: function (data) {
        	utils.modal.toast(data.message || _t('Your quiz has been deleted'));
            this.$el.remove();
        },
        updateView: function () {
            var bIsOpening = !this.model.isClosed();
            this.$closedIcon.toggleClass('hide', bIsOpening);
        }
    });
});