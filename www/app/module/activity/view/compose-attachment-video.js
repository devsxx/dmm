define([
    'text!activity/tpl/attachment-video.html',
    'text!activity/tpl/compose-attachment-video.html'
], function(attachmentTpl, tpl) {

    var StatusVideo = Backbone.View.extend({
        events: {
            'click #video_form_save_btn': 'saveVideo'
        },
        region: {
            main: '#simple-popup', // main region is where the html contain is injected
        },
        template: _.template(tpl),
        render: function(context) {

            this.context = $.extend({
                fileURI: ''
            }, context);

            this.$el.html(this.template());
            this.$save_btn = $('#video_form_save_btn', this.$el);
            this.$form_title = $('#video_form_title', this.$el);

            return this;
        },
        inject: function() {

            utils.popup.open(this.$el);

            return this;
        },
        saveVideo: function() {

            var data = {
                sTitle: this.$form_title.val() || '',
                fileURI: this.context.fileURI
            };

            var attachmentHtml = _.template(attachmentTpl, data);

            utils.observer.trigger('attachment:success', {
                data: data,
                html: attachmentHtml,
                type: 'video'
            });

            this.close();
        },
        close: function() {

            utils.popup.close();

            return this;
        }
    });

    return StatusVideo;
});