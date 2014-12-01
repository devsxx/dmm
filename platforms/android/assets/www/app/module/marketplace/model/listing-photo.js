define(function() {

    return Backbone.Model.extend({
        idAttribute: 'iImageId',
        defaults: {
            sModelType: 'image'
        },
        getPhotoUrl: function() {
            return this.get('sImagePath') || '';
        }
    });
});