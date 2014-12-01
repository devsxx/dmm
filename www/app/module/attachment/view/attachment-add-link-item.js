define([
    'attachment/view/attachment-add-item',
    'text!attachment/tpl/attachment-add-link-item.html'
], function(AttachmentAddItemView, text) {

    return AttachmentAddItemView.extend({
        className: 'user_add_content link',
        template: _.template(text),
        getPostDataDelete: function() {

            return {
                iItemId: this.model.getId(),
                sModule: this.context.sModule,
                sType: 'link'
            };
        }
    });
});