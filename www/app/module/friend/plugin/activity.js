define(function() {
    utils.headline.add('friends', function(item) {
        item.set('sContent', ''); // fix issue with socialengine content can not translate.
        return _t('is now friend with %s', item.getObjectLink(11));
    })
});