define([
    'core'
], function() {
    var Model = Backbone.Model.extend({
        idAttribute: 'iVideoId',
        defaults: {
            sModelType: 'video',
            bCanRate: true,
            bCanLike: true,
            bCanComment: true,
            bCanShare: true
        }
    });

    Model.prototype.isInProcess = function() {
        return this.get('bInProcess') || false;
    }


    Model.prototype.getEmbedHtml = function() {
        return this.get('sEmbed');
    }


    Model.prototype.getImageSrc = function() {
        return this.get('sVideoImage');
    }

    Model.prototype.getDuration = function() {
        return parseInt(this.get('iDuration', 10)) || 0;
    }

    Model.prototype.getDurationFormat = function() {
        return this.get('iDuration');
    }

    Model.prototype.canRate = function() {
        return true;
    }

    Model.prototype.getCategoryId = function() {
        return this.get('iCategoryId') || this.get('iCategory') || 0;
    }

    Model.prototype.getViewPrivacyVal = function() {
        return this.get('iPrivacy') || '0';
    }

    Model.prototype.getCommentPrivacyVal = function() {
        return this.get('iPrivacyComment') || '0';
    }

    Model.prototype.getDescriptionParsed = function() {

        var sDescription = this.get('sDescription') || '';

        return utils.helper.parseExternalLink(sDescription);
    }

    Model.prototype.getVideoUrl = function() {
        return this.get('sVideoUrl') || '';
    }

    Model.prototype.getVideoType = function() {
        return this.get('sType') || '';
    }

    return Model;
});