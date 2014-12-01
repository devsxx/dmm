define([
    'attachment/model/attachment-link',
    'attachment/model/attachment-photo',
    'forum/model/thread'
], function(AttachmentLinkModel, AttachmentPhotoModel, ThreadModel) {
    return Backbone.Model.extend({
        idAttribute: 'iPostId',
        defaults: {
            sModelType: 'forum_post',
            bCanLike: true
        },
        getTotalPost: function() {
            return this.get('iTotalPost') || 0;
        },
        getText: function() {

            var sText = this.get('sText') || '';

            return utils.helper.parseExternalLink(sText);
        },
        getTextNotParsed: function() {
            return this.get('sTextNotParsed') || '';
        },
        getAttachments: function() {
            return this.get('aAttachments') || [];
        },
        hasAttachments: function() {
            return this.getAttachments().length > 0;
        },
        getAttachmentPhotos: function() {

            if (!this.hasAttachments()) {
                return [];
            }

            var aPhotos = this.getAttachments().filter(function(aAttachment) {
                return aAttachment.type == 'image';
            });

            if (aPhotos.length == 0) {
                return [];
            }

            var aAtts = _.map(aPhotos, function(oPhoto) {
                return new AttachmentPhotoModel($.extend({
                    attachment_id: oPhoto.attachment_id,
                    type: oPhoto.type
                }, oPhoto.data));
            }, this);

            return aAtts;
        },
        getAttachmentLinks: function() {

            if (!this.hasAttachments()) {
                return [];
            }

            var aLinks = this.getAttachments().filter(function(aAttachment) {
                return aAttachment.type == 'link';
            });

            if (aLinks.length == 0) {
                return [];
            }

            var aAtts = _.map(aLinks, function(oLink) {
                return new AttachmentLinkModel($.extend({
                    attachment_id: oLink.attachment_id,
                    type: oLink.type
                }, oLink.data));
            }, this);

            return aAtts;
        },
        canQuote: function() {
            return this.get('bCanQuote') || false;
        },
        getThread: function() {
            return new ThreadModel({
                iThreadId: this.get('iThreadId') || 0,
                sTitle: this.get('sTitle') || ''
            });
        },
        getThreadId: function() {
            return this.getThread().getId();
        },
        getThreadTitle: function() {
            return this.getThread().getTitle();
        },
        getThreadUrl: function() {
            return this.getThread().getUrl();
        },
        /**
         * add this prototype to support social share.
         */
        getSocialShareUrl :  function(){
          return constants.siteUrl + 'index.php?do=/forum/thread/'+ this.getThreadId() + '/slug/view_'+ this.getId();
        }
    });
});