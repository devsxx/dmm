define([
    'poll/model/poll',
    'poll/view/poll-add'
], function(PollModel, PollAddView) {

    return PollAddView.extend({
        apiAdd: 'forum/threadpolladd',
        region: {
            holder: '#main-bottom',
            scroller: '#content-bottom',
            form_holder: '#poll-add'
        },
        render: function(context) {

            this.context = $.extend({
                action: 'attach'
            }, context);

            this.$el.html(this.template({
                context: this.context
            }));

            this.$form_holder = this.$el.find(this.region.form_holder);
            this.$save_btn = this.$el.find('#save_btn');

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            utils.observer.trigger('bottom:open');
        },
        saveDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            var poll = new PollModel(data.aPoll);

            this.trigger('attachsuccess', poll);

            utils.observer.trigger('bottom:close');
        }
    });
});