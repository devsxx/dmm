define([
    'event/view/attachment-event'
], function(EventView) {

    utils.headline.add([
        'event',
        'fevent'
    ], function(item) {
        return _t('created an event');
    });

    utils.headline.add(['event_comment', 'fevent_comment'], function(item, context) {

        var headline = item.getPosterLink();

        if (item.hasParentUser()) {
            return headline += '<i class="activity-post-via"> &rarr; </i> ' + item.getParentLink();
        }

        return headline;
    });

    utils.attachment.add(['event', 'fevent'], EventView);
});