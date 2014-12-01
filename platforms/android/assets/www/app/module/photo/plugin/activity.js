define([
    'photo/view/attachment-album',
    'photo/view/attachment-photo'
], function(AlbumView, PhotoView) {

    utils.headline.add(['photo', 'advancedphoto'], function(item) {
        if (item.hasAttachment()) {

            if (!item.hasParentUser()) {
                var aAttachments = item.getAttachments();
                if (aAttachments.length > 1) {
                    return _t('shared_a_few_photos');
                } else {
                    return _t('shared_a_photo');
                }
            } else {
                return '<i class="activity-post-via"> &rarr; </i> ' + item.getParentLink();
            }
        } else {
            return '';
        }
    });

    utils.attachment.add(['photo', 'advancedphoto'], PhotoView);
});