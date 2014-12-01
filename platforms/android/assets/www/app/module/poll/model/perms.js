define(function() {

    return Backbone.Model.extend({
        getMaxAnswer: function() {
            return this.get('iMaxAnswer') || 0;
        },
        canAddPoll: function() {
            return this.get('bCanCreatePoll') || false;
        },
        canEditTitle: function() {
            return this.get('bCanEditTitle') || false;
        },
        canEditQuestion: function() {
            return this.get('bCanEditQuestion') || false;
        },
        canEditPoll: function() {

            if (!this.canEditTitle() && !this.canEditQuestion()) {
                return false;
            }

            return this.get('bCanEditOwnPoll') || false;
        }
    });
});