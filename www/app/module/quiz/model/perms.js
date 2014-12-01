define(function() {

    return Backbone.Model.extend({
        canCreateQuiz: function() {
            return this.get('bCanCreateQuiz') || false;
        },
        canEditOwnTitle: function() {
            return this.get('bCanEditOwnTitle') || false;
        },
        canEditOwnQuestion: function() {
            return this.get('bCanEditOwnQuestion') || false;
        },
        canEditOwnQuiz: function() {
            return this.canEditOwnTitle() || this.canEditOwnQuestion();
        }
    });
});