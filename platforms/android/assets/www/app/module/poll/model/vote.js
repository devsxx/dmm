define(function() {

    return Backbone.Model.extend({
        getAnswer: function() {
            return this.get('sAnswer') || '';
        },
        getFormatedTime: function() {
            return utils.moment(this.getTimestamp() * 1e3).format('LL');
        }
    });
});