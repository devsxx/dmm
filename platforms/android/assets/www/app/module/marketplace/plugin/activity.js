define([
    'marketplace/view/attachment-listing'
], function(ListingAttachmentView) {

    utils.headline.add([
        'advancedmarketplace',
        'marketplace'
    ], function(item) {
        return _t('created a listing.');
    });

    utils.attachment.add(['advancedmarketplace', 'marketplace'], ListingAttachmentView);
});