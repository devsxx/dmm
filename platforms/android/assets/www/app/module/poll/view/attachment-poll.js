define([
    'poll/model/poll',
    'text!poll/tpl/attachment-poll.html'
], function(PollModel, text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-poll',
        template: _.template(text),
        render: function() {

            var item = this.model;
            var oAtt = item.getAttachments()[0];

            var att = new PollModel({
                iPollId: oAtt.iId,
                sPollImage: oAtt.sPhoto_Url,
                sQuestion: oAtt.sTitle,
                iTotalVotes: oAtt.iTotalVotes,
                bHasImage: oAtt.bHasImage
            });

            var context = {
                item: item,
                att: att
            };

            this.$el.html(this.template(context));

            return this;
        },
        inject: function(dom) {
            dom.html(this.el);
        }
    });
});