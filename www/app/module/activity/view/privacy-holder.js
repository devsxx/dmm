define([
    'text!activity/tpl/privacy-holder.html',
	'activity/view/choose-privacy',
    'activity/collection/privacy'
], function(text) {
    var ChoosePrivacy = require('activity/view/choose-privacy')
      , PrivacyCollection = require('activity/collection/privacy');

    var PrivacyHolder = Backbone.View.extend({
        template: _.template(text),
        initialize: function() {
            this.model = new PrivacyCollection();
            this.model.on('privacy-chosen', function() {
                this.render();
            }, this);
        },
        events: {
            'click': 'showPrivacy',
        },
        region:{
            main: '#privacy_holder',
        },
        render: function() {
            this.$el.html(this.template({
                item: this.model.getChosen()
            }));

            return this;
        },

        getChosenValue: function() {
            return this.model.getChosen().getValue();
        },

        inject: function() {
            var main = $(this.region.main);
            
            main.html(this.el);
            
            return this;
        },

        showPrivacy: function() {
            new ChoosePrivacy({
                model: this.model
            }).render().inject();
            this.fetchData();
        },

        fetchData: function() {
            // if(this.collection.length > 0) {
            //     return ;
            // }

            var data = {
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('privacy/privacy', data, settings).done(this.postDone).always(this.postComplete);

        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post link failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postSuccess: function (data) {
            this.model.set(data);
            // constants.privacies = data;
        },
    });

    return PrivacyHolder;
});

