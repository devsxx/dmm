define([
    'blog/view/attachment-blog'
], function(BlogAttachmentView) {

    utils.headline.add([
        'blog'
    ], function(item) {
        return _t('ဘေလာ့ တစ္ခုတင္ပါသည္။');
    });

    utils.attachment.add(['blog'], BlogAttachmentView);
});