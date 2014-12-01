define([
    'text!user/tpl/edit-user-cover.html',
], function() {

    var text = require('text!user/tpl/edit-user-cover.html');

    return Backbone.View.extend({
        initialize: function() {},
        events: {
            'click #save-photo': 'savePhoto'
        },
        template: _.template(text),
        region: {
            main: '#main',
        },
        render: function(context) {

            this.context = $.extend({
                imageURI: ''
            }, context);

            this.$holder = $(this.region.main);

            this.$el.html(this.template({
                context: this.context
            }));

            this.$scroller = this.$el.find('#content');

            this.$postBtn = this.$el.find('#save-photo');

            this.$img_container = this.$el.find('#img_container');

            return this;
        },

        inject: function() {

            this.$holder.html(this.$el);

            return this;
        },

        savePhoto: function() {

            var params = {
                iUserId: this.model.getId()
            };

            function done(result) {
                utils.modal.toast('Edit sucessfully');
                utils.history.back();
            };

            function fail(result) {
                utils.modal.alert(JSON.stringify(result));
                // utils.modal.alert('Cannot upload photo');
            };

            utils.api.uploadImage('user/edit_cover', this.context.imageURI, params).done(done).fail(fail);
        }
    });
});