define([
    'marketplace/model/listing',
    'text!marketplace/tpl/attachment-listing.html'
], function(Model, text) {

    return Backbone.View.extend({
        region: {},
        className: 'attachment-listing',
        template: _.template(text),
        render: function() {

            var feed = this.model;
            var oAtt = feed.getAttachments()[0];

            var item = new Model($.extend(oAtt, {
                iListingId: oAtt.iId,
                sMarketplaceImage: oAtt.sPhoto_Url
            }));

            this.$el.html(this.template({
                item: item
            }));

            return this;
        },
        inject: function(dom) {
            dom.html(this.el);
        }
    });
});