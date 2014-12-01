define(function() {

    return Backbone.Model.extend({
        idAttribute: 'iThreadId',
        defaults: {
            sModelType: 'forum_thread',
            bCanView: true
        },
        getLivetime: function() {
            return utils.moment(this.getTimestamp() * 1e3).fromNow(true);
        },
        getLastUserId: function() {
            return parseInt(this.get('iLastUserId')) || 0;
        },
        getLastFullName: function() {
            return this.get('sLastFullname') || '';
        },
        hasLastUser: function() {
            return this.getLastUserId() ? true : false;
        },
        getLastUserUrl: function() {
            return this.hasLastUser() ? '#user/' + this.getLastUserId() : this.getPosterUrl();
        },
        getLastUserTitle: function() {
            return this.hasLastUser() ? this.getLastFullName() : this.getPosterTitle();
        },
        getTimeUpdate: function() {
            return this.get('iTimeUpdate') || 0;
        },
        getLiveTimeUpdate: function() {
            return utils.moment(this.getTimeUpdate() * 1e3).fromNow();
        },
        getTotalPost: function() {
            return this.get('iTotalPost') || 0;
        },
        getTotalView: function() {
            return this.get('iTotalView') || 0;
        },
        isAnnouncement: function() {
            return this.get('bIsAnnouncement') || false;
        },
        getOrderId: function() {
            return parseInt(this.get('iOrderId')) || 0;
        },
        isSticky: function() {
            return this.getOrderId() ? true : false;
        },
        isSubscribed: function() {
            return this.get('bIsSubscribed') || false;
        },
        isClosed: function() {
            return this.get('bIsClosed') || false;
        },
        getPollId: function() {
            return parseInt(this.get('iPollId')) || 0;
        },
        hasPoll: function() {
            return this.getPollId() || false;
        },
        getText: function() {
            return this.get('sText') || '';
        },
        getTextNotParsed: function() {
            return this.get('sTextNotParsed') || '';
        },
        /**
         * add this prototype to support social share.
         */
        getSocialShareUrl :  function(){
          return constants.siteUrl + 'index.php?do=/forum/thread/'+ this.getId();
        }
    });
});