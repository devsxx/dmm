define(function() {

    return Backbone.Model.extend({
        idAttribute: 'attachment_id',
        defaults: {
            sModelType: 'image'
        },
        getPhotoUrl: function() {
            return this.get('photo_url') || '';
        }
    });
});