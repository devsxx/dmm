define([
    'activity/view/compose-status'
], function(View) {

    function Controller(sItemType, iItemId) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new View().render({
            sItemType: sItemType,
            iItemId: iItemId
        }).inject();
    }
    utils.router.route('activity/compose-status(/:sItemType)(/:iItemId)', Controller);

    function handleComposeStatusPhoto(sItemType, iItemId) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new View().render({
            sItemType: sItemType,
            iItemId: iItemId,
            trigger: 'camera'
        }).inject();

    }
    utils.router.route('activity/compose-status-photo(/:sItemType)(/:iItemId)', handleComposeStatusPhoto);

    function handleComposeStatusCheckin(sItemType, iItemId) {

        utils.history.push();

        utils.observer.trigger('router:changed');

        new View().render({
            sItemType: sItemType,
            iItemId: iItemId,
            trigger: 'checkin'
        }).inject();

    }
    utils.router.route('activity/compose-status-checkin(/:sItemType)(/:iItemId)', handleComposeStatusCheckin);
});