define([
    'attachment/view/attachment-add-item',
    'text!attachment/tpl/attachment-add-photo-item.html'
], function(AttachmentAddItemView, text) {

    return AttachmentAddItemView.extend({
        className: 'attachment-photo-item',
        template: _.template(text),
        getPostDataDelete: function() {

            return {
                iItemId: this.model.getId(),
                sModule: this.context.sModule,
                sType: 'file'
            };
        }
    });
});