define([
    'attachment/model/attachment-link',
    'attachment/model/attachment-photo'
], function(AttachmentLinkModel, AttachmentPhotoModel) {

    return Backbone.Model.extend({
        idAttribute: 'iBlogId',
        defaults: {
            sModelType: 'blog',
            bCanView: true,
            bCanLike: true
        },
        getTopics: function() {
            return this.get('aTagList') || [];
        },
        getTextTopics: function() {
            var aTopics = this.getTopics();
            var aTextTopics = [];

            _.each(aTopics, function(aTopic) {
                aTextTopics.push(aTopic.tag_text);
            });

            return aTextTopics.join(', ');
        },
        getText: function() {

            var sText = this.get('sText') || '';

            return utils.helper.parseExternalLink(sText);
        },
        getTextNotParsed: function() {
            return this.get('sTextNotParsed') || '';
        },
        isPublish: function() {
            return this.get('bIsPublish') || false;
        },
        isApproved: function() {
            return this.get('bIsApproved') || false;
        },
        getUserSettingApproveBlogs: function() {
            return this.get('bUserSettingApproveBlogs') || false;
        },
        getAttachments: function() {
            return this.get('aAttachment') || [];
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
        getCategoryOptions: function(filter) {

            filter = filter || 'public';

            return this.get('category_options')[filter] || [];
        },
        getViewOptions: function() {
            return this.get('view_options') || [];
        },
        getCommentOptions: function() {
            return this.get('comment_options') || [];
        },
        getPrivacy: function() {
            return this.get('iPrivacy') || 0;
        },
        getCommentPrivacy: function() {
            return this.get('iPrivacyComment') || 0;
        },
        getFormatedTime: function() {
            return utils.moment(this.getTimestamp() * 1e3).format('LL');
        }
        
    });
});