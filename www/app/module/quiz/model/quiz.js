define(function () {

    return Backbone.Model.extend({
        idAttribute: 'iQuizId',
        defaults: {
            sModelType: 'quiz',
            bCanView: true,
            bCanLike: true,
            bCanDislike: true,
            bCanComment: true,
            bCanShare: true
        },
        getVoteCount: function () {
            return this.get('iTotalVote') || 0;
        },
        getViewCount: function () {
            return this.get('iTotalView') || 0;
        },
        getLivetime: function () {
            return utils.moment(this.getTimestamp() * 1e3).fromNow();
        },
        isClosed: function () {
            return this.get('bIsClosed') || false;
        },
        getViewOptions: function () {
            return this.get('view_options');
        },
        getCommentOptions: function () {
            return this.get('comment_options');
        },
        getViewPrivacy: function () {
            return this.get('sViewPrivacy');
        },
        getCommentPrivacy: function () {
            return this.get('sCommentPrivacy');
        },
        hasDescription: function () {
            return this.get('sDescription') ? true : false;
        },
        getQuestions: function () {
            return this.get('questions');
        },
        getTakerList: function () {
            return this.get('takers');
        },
        getTotalTakers: function () {
            return this.get('iTakerCount') || 0;
        },
        getTotalQuestions: function () {
            return this.get('iQuestionCount') || 0;
        },
        getImageSrc: function () {
            return this.get('sImageUrl');
        },
        canTake: function () {
            return this.get('bCanTake');
        },
        getDetail:  function () {
            return this.get('detail') || '';
        },
        getTitle: function () {
            return this.get('sTitle') || this.getDetail().sTitle || '';
        },
        getDescription: function () {
            return this.get('sDescription') || this.getDetail().sDescription || '';
        },
        getViewPrivacy: function () {
            return this.get('iPrivacy') || this.getDetail().iPrivacy || 0;
        },
        getCommentPrivacy: function () {
            return this.get('iCommentPrivacy') || this.getDetail().iCommentPrivacy || 0;
        }
    });
});