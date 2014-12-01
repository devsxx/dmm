define(function() {

    return Backbone.Model.extend({
        idAttribute: 'attachment_id',
        defaults: {
            sModelType: 'link'
        },
        getPhotoUrl: function() {
            return this.get('image') || '';
        },
        getTitle: function() {
            return this.get('title') || '';
        },
        getDescription: function() {
            return this.get('description') || '';
        },
        getUrl: function() {
            return this.get('link') || this.get('url') || '';
        },
        getHostName: function() {

            var url = this.getUrl();

            var el = document.createElement('a');
            el.href = url;

            return el.hostname;
        }
    });
});