define([

], function() {

    utils.headline.add(['post', 'feed_comment'], function(item, context) {

        var headline = item.getPosterLink();

        if (item.hasParentUser()) {
            return headline += '<i class="activity-post-via"> &rarr; </i> ' + item.getParentLink();
        }

        return headline;
    });

    utils.headline.add('signup', function(item) {
        return _t('has just signed up. Say hello!');
    });

    utils.headline.add('profile_photo_update', function(item) {
        return _t('has added a new profile photo.');
    });



    utils.headline.add('post_self', function(item) {
        return item.getPosterLink();
    });

    utils.headline.add('status', function(item) {
        return item.getPosterLink();
    });

    utils.headline.add(['user_status', 'custom', 'user_photo'], function(item) {
        return '';
    });
});