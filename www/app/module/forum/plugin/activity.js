define([
    'forum/view/attachment-forum-post',
    'forum/view/attachment-forum-thread'
], function(PostAttachmentView, ThreadAttachmentView) {

    utils.headline.add([
        'forum'
    ], function(item) {
        return _t('posted a thread.');
    });

    utils.headline.add([
        'forum_post'
    ], function(item) {
        return _t('replied a thread.');
    });

    utils.attachment.add(['forum'], ThreadAttachmentView);
    utils.attachment.add(['forum_post'], PostAttachmentView);
});