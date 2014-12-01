define([
    'notification/plugin/notification-type'
], function(notificationType) {
    return Backbone.Model.extend({
        idAttribute: 'iNotificationId',
        defaults: {
            sResourceType: 'user',
            iResourceId: 0,
            sMessage: '',
            sUserImage: ''
        },
        getTypeId: function() {
            return this.get('sTypeId');
        },
        getItemUrl: function() {
            return notificationType.getItemDetailUrl(this);
        },
        getHeadline: function() {
            if (!this.get('sMessage')) {
                return '';
            }
            return this.get('sMessage').replace(/(<span [^>]+>)([^<]+)+(<\/span>?)+/ig, '<span class="text-anchor">$2</span>');
        },
        getPosterImageSrc: function() {
            return this.get('sUserImage');
        }
    });

});