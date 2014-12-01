define([
    'attachment/view/attachment-add-photo-item'
], function(AttachmentAddPhotoItem) {

    return AttachmentAddPhotoItem.extend({
        apiDelete: 'marketplace/photodelete',
        getPostDataDelete: function() {

            return {
                iImageId: this.model.getId()
            };
        }
    });
});