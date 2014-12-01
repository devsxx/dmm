define([
    'quiz/view/attachment-quiz'
], function(AttachmentView) {

    utils.headline.add([
        'quiz'
    ], function(item) {
        return _t('created a quiz');
    });

    utils.headline.add([
        'comment_quiz'
    ], function(item) {
        var itemLink = '<a href="' + item.getItemUrl() + '">quiz</a>';
        return _t('commented on %s\'s %s', item.getOwnerLink(), itemLink);
    });

    utils.attachment.add(['quiz'], AttachmentView);
});