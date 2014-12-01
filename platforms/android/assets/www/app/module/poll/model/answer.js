define(function() {

    return Backbone.Model.extend({
        idAttribute: 'iAnswerId',
        defaults: {
            sModelType: 'poll_answer'
        },
        getAnswer: function() {
            return this.get('sAnswer') || '';
        },
        getTotalVote: function() {
            return parseInt(this.get('iTotalVotes')) || 0;
        },
        getVotePercent: function() {
            return this.get('iVotePercentage') || 0;
        }
    });
});