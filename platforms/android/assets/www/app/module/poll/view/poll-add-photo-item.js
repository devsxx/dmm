define([
    'attachment/view/attachment-add-photo-item'
], function(AttachmentAddPhotoItem) {

    return AttachmentAddPhotoItem.extend({
        apiDelete: 'poll/deleteimage',
        getPostDataDelete: function() {

            return {
                iPollId: this.context.iPollId
            };
        }
    });
});