define([
    'text!activity/tpl/choose-privacy.html',
    'activity/view/choose-privacy-item'
], function() { 
    var tpl = require('text!activity/tpl/choose-privacy.html'),
        PrivacyItemView = require('activity/view/choose-privacy-item');


    var ChoosePrivacy = Backbone.View.extend({
        initialize: function() {
            this.model.on('all', function() {
                this.updateView();
            }, this);

            this.model.on('privacy-chosen', function() {
                this.close();
            }, this);
        },
        className: 'privacy-list',
        region: {
			// main: '#simple-popup', // main region is where the html contain is injected
            // attachment_holder: '#compose_status_select_attachment_holder'
        },
        events: {
            // 'click #submit_link_btn': 'submitLink'
        },
		template : _.template(tpl),
        render: function() {
            this.$el.html(this.template());
            
            return this;
        },

        inject: function() { 
            
            utils.popup.open(this.$el);

            if(this.model.length > 0) {
                this.updateView();
            }
			
			return this;
        },

        close: function() {
		    utils.popup.close();	
			
			return this;
        },


        updateView: function(data) {
            this.$el.html('');
            _.each(this.model.models, function(item) {
                if(item.getValue() == 4) {
                    //do nothing with custome type
                } else {
                    this.$el.append(new PrivacyItemView({
                        model: item
                    }).render().el);
                }
                
            }, this);
        }

    });

    return ChoosePrivacy;
});


