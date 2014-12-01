define([
	'text!photo/tpl/photo-item-in-profile.html',
], function() {
    var textInProfile = require('text!photo/tpl/photo-item-in-profile.html')

    return {
		templateInProfile: _.template(textInProfile),
        render: function() {
			this.$el.attr('id', this.model.getDataId());

            if(this.model.getType() == 'profile_photo' || this.model.getType() == 'event_photo') {
                this.$el.html(this.templateInProfile({item: this.model}));
            } else {
                this.$el.html(this.template({item: this.model}));
            }

			return this;
        }

    };
});
