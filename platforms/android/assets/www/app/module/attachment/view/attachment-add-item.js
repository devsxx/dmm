define(function(text) {

    return Backbone.View.extend({
        apiDelete: 'attachment/delete',
        template: null,
        render: function(context) {

            this.context = $.extend({
                postDelete: true
            }, context);

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        inject: function(callback) {

            callback(this.$el);

            return this;
        },
        events: {
            'click .remove-attachment': 'onRemoveAttachmentClick'
        },
        onRemoveAttachmentClick: function(evt) {

            if (this.context.postDelete) {
                var self = this;

                utils.modal.confirm(_t('Are you sure?'), function(selected) {
                    if (selected == 1) {
                        self.removeAttachment(evt);
                    }
                });
            } else {
                this.removeSuccess();
            }
        },
        removeAttachment: function(evt) {

            var postData = this.getPostDataDelete();
            var settings = {
                context: this
            };

            utils.api.post(this.apiDelete, postData, settings).done(this.removeDone).fail(this.removeFail);
        },
        getPostDataDelete: function() {

            return {
                iItemId: this.model.getId()
            };
        },
        removeDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server.'));
            }

            this.removeSuccess(data);
        },
        removeSuccess: function(data) {

            // remove element
            this.$el.remove();

            this.trigger('removesuccess', this.model);
        },
        removeFail: function(jqXHR, textStatus, errorThrown) {

            utils.modal.alert('Can not delete attachment. Please try again later.');

            utils.debug.warn('removeFail', arguments);
        }
    });
});