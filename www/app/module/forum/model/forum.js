define(function() {
    var ForumModel = Backbone.Model.extend({
        idAttribute: 'iForumId',
        defaults: {
            sModelType: 'forum',
            bCanView: true
        },
        getTitle: function() {
            return this.get('sName') || '';
        },
        getAnnouncementCount: function() {
            return this.get('iTotalAnnouncement') || 0;
        },
        getThreadCount: function() {
            return this.get('iTotalThread') || 0;
        },
        getPostCount: function() {
            return this.get('iTotalPost') || 0;
        },
        getChildCount: function() {
            return this.get('iTotalSubForum') || 0;
        },
        getChilds: function() {

            var aChilds = this.get('aSubForum') || [];

            var childs = _.map(aChilds, function(oChild) {
                return new ForumModel(oChild);
            }, this);

            return childs;
        },
        isCategory: function() {
            return this.get('bIsCategory') || false;
        },
        canAddThread: function() {
            return this.get('bCanAddThread') || false;
        }
    });

    return ForumModel;
});