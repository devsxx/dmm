define([
    'page/view/attachment-pages'
], function(PagesAttachmentView) {

    utils.headline.add([
        'pages'
    ], function(item) {
        return _t('shared a page');
    });

    utils.headline.add(['pages_comment'], function(item) {

        var headline = item.getPosterLink();

        if (item.hasParentUser()) {
            return headline += '<i class="activity-post-via"> &rarr; </i> ' + item.getParentLink();
        }

        return headline;
    });

    utils.attachment.add(['pages'], PagesAttachmentView);
});