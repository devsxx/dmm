define([
    'link/view/attachment-link'
], function(LinkView) {
    utils.attachment.add(['core_link', 'link'], LinkView);
    utils.headline.add(['link'], function(item) {
        if (item.hasParentUser()) {
            return '<i class="activity-post-via"> &rarr; </i> ' + item.getParentLink();
        } else {
            return _t('shared_a_link');
        }
    });
});