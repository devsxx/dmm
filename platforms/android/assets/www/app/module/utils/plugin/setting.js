define([
    'utils/plugin/api',
    'utils/plugin/observer'
], function(api, observer) {

    var Settings = Backbone.Model.extend({
        defaults: {
            like_allow_dislike: true,
            mfox_limit_photo_to_scroll: 3,
            user_date_of_birth_start: 1900,
            user_date_of_birth_end: 1997,
            cometchat_enabled: false,
            chat_enabled: false
        },
        fetchData: function() {
            api.get('core/settings', {}, {
                context: this,
                async: false
            })
                .done(this.fetchDataComplete)
                .fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {
            if (data.error_code) {
                // do nothing
            } else {
                this.set(data);
                localStorage.setItem('settings', JSON.stringify(data));
            }
        },
        fetchDataFail: function() {

        },
        initialize: function() {
            var cached = localStorage.getItem('settings');
            if (cached) {
                cached = JSON.parse(cached);
                this.set(cached);
            }
        }
    });

    // check to reload setting utils.
    var settings = new Settings({});

    observer.on('app:init user:login', function() {
        settings.fetchData();
    })

    return settings;
});