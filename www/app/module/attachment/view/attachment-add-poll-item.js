define([
    'attachment/view/attachment-add-item',
    'text!attachment/tpl/attachment-add-poll-item.html'
], function(AttachmentAddItemView, text) {

    return AttachmentAddItemView.extend({
        apiDelete: 'forum/threadpolldelete',
        className: 'user_add_content poll',
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                postDelete: true,
                iThreadId: 0
            }, context);

            this.$el.html(this.template({
                item: this.model
            }));

            return this;
        },
        getPostDataDelete: function() {

            return {
                iPollId: this.model.getId(),
                iThreadId: this.context.iThreadId
            };
        }
    });
});