define([
    'poll/model/answer'
], function(AnswerModel) {

    return Backbone.Model.extend({
        idAttribute: 'iPollId',
        defaults: {
            sModelType: 'poll',
            bCanView: true,
            bCanLike: true
        },
        getQuestion: function() {
            return this.get('sQuestion') || '';
        },
        getAnswers: function() {

            var aAnswers = this.get('aAnswer') || [];

            return aAnswers.map(function(oAnswer) {
                return new AnswerModel(oAnswer);
            });
        },
        getTotalAnswer: function() {
            return this.getAnswers().length || 0;
        },
        isVoted: function() {
            return this.get('bIsVoted') || false;
        },
        getTotalVote: function() {
            return parseInt(this.get('iTotalVotes')) || 0;
        },
        getPrivacyId: function() {
            return parseInt(this.get('iPrivacy')) || 0;
        },
        getPrivacyCommentId: function() {
            return parseInt(this.get('iPrivacyComment')) || 0;
        },
        isHideVote: function() {
            return this.get('bIsHideVote') || false;
        },
        hasImage: function() {
            return this.get('bHasImage') || false;
        },
        getImageSrc: function() {
            return this.get('sPollImage') || '';
        },
        isApproved: function() {
            return this.get('bIsApproved') || false;
        },
        canViewUserResult: function() {
            return this.get('bCanViewUserResult') || false;
        },
        canViewResult: function() {
            return this.get('bCanViewResult') || false;
        },
        getAnswerId: function() {
            return this.get('iAnswerId') || 0;
        }
    });
});