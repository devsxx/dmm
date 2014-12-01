define([
    'poll/view/attachment-poll'
], function(PollAttachmentView) {

    utils.headline.add([
        'poll'
    ], function(item) {
        return _t('created a poll.');
    });

    utils.attachment.add(['poll'], PollAttachmentView);
});