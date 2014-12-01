define([
    'utils/plugin/livetime',
], function(livetime) {
    Backbone.Model.prototype.getId = function() {
        return this.id;
    }

    Backbone.Model.prototype.getType = function() {
        return this.get('sModelType');
    }

    Backbone.Model.prototype.getGID = function() {
        return this.getType() + '@' + this.getId();
    }

    Backbone.Model.prototype.getTimestamp = function() {
        return this.get('iTimeStamp') || this.get('iTimestamp') || 0;
    }

    Backbone.Model.prototype.getLivetime = function() {
        return utils.moment(this.getTimestamp() * 1e3).fromNow();
    }

    Backbone.Model.prototype.getTimeConverted = function() {
        return this.get('sTimeConverted');
    }

    Backbone.Model.prototype.canView = function() {
        return this.get('bCanView') ? 1 : 0;
    }

    /**
     * can like ?
     * @return bool
     */
    Backbone.Model.prototype.canLike = function() {
        return this.get('bCanLike') ? 1 : 0;
    }

    Backbone.Model.prototype.canDislike = function() {
        return (utils.setting.get('like_allow_dislike') && this.get('bCanDislike')) || false;
    }

    /**
     * can share ?
     * @return bool
     */
    Backbone.Model.prototype.canShare = function() {
        return (this.get('bCanShare') == void 0) ? 1 : (this.get('bCanShare') ? 1 : 0);
    }

    /**
     * can rate ?
     * @return bool
     */
    Backbone.Model.prototype.canRate = function() {
        return this.get('bCanRate');
    }

    /**
     * can comment
     * @return bool
     */
    Backbone.Model.prototype.canComment = function() {
        return (this.get('bCanComment') || this.get('bCanPostComment')) ? 1 : 0;
    }

    /**
     * is liked ?
     */
    Backbone.Model.prototype.isLiked = function() {
        return (this.get('bIsLiked')) ? 1 : 0;
    }

    Backbone.Model.prototype.isDisliked = function() {
        return this.get('bIsDisliked') || false;
    }

    Backbone.Model.prototype.isRated = function() {
        return this.get('bIsRating') ? 1 : 0;
    }

    Backbone.Model.prototype.getCategory = function() {
        return this.get('iCategoryId') || this.get('iCategory');
    }

    Backbone.Model.prototype.getTitle = function() {
        return this.get('sTitle') || '';
    }

    Backbone.Model.prototype.getDescription = function() {
        return this.get('sDescription') || '';
    }

    Backbone.Model.prototype.getRateCount = function() {
        return this.get('iRatingCount') || 0;
    }

    Backbone.Model.prototype.getRateValue = function() {
        return (Math.round((this.get('fRating') || 0) * 10) / 10).toString().replace('.0', '');
    }

    Backbone.Model.prototype.getRateFloatValue = function() {
        return this.get('fRating') || 0;
    }

    /**
     * number of like
     */
    Backbone.Model.prototype.getLikeCount = function() {
        return parseInt(this.get('iTotalLike') || 0, 10);
    }

    Backbone.Model.prototype.getDislikeCount = function() {
        return parseInt(this.get('iTotalDislike') || 0, 10);
    }

    Backbone.Model.prototype.getLikeCountLabel = function() {
        var count = this.getLikeCount();

        return count == 1 ? _t('%s Like', count) : _t('%s Likes', count);
    }

    Backbone.Model.prototype.getDislikeCountLabel = function() {
        var count = this.getDislikeCount();

        return count == 1 ? _t('%s Dislike', count) : _t('%s Dislikes', count);
    }

    Backbone.Model.prototype.getCommentCountLabel = function() {
        var count = this.getCommentCount();

        return count == 1 ? _t('%s Comment', count) : _t('%s Comments', count);
    }

    Backbone.Model.prototype.getShareCountLabel = function() {
        return _t('Share');
    }

    Backbone.Model.prototype.getRateValueLabel = function() {
        return _t('%s Rating', this.getRateValue());
    }

    Backbone.Model.prototype.getDataId = function(prefix) {
        if (arguments.length) {
            return [prefix, this.getType(), this.getId()].join('-');
        }
        return [this.getType(), this.getId()].join('-');
    }

    // type;id;count;canLike;isLiked
    Backbone.Model.prototype.getDataLike = function() {
        return [this.getType(), this.getId(), this.getLikeCount(), this.canLike() ? 1 : 0, this.isLiked() ? 1 : 0].join(';');
    }

    Backbone.Model.prototype.getDataDislike = function() {
        return [this.getType(), this.getId(), this.getDislikeCount(), this.canDislike() ? 1 : 0, this.isDisliked() ? 1 : 0].join(';');
    }

    Backbone.Model.prototype.getIdLike = function() {
        return ['like', this.getType(), this.getId()].join('_');
    }

    Backbone.Model.prototype.getIdDislike = function() {
        return ['dislike', this.getType(), this.getId()].join('_');
    }

    Backbone.Model.prototype.getIdShare = function() {
        return ['share', this.getType(), this.getId()].join('_');
    }

    Backbone.Model.prototype.getIdComment = function() {
        return ['comment', this.getType(), this.getId()].join('_');
    }

    Backbone.Model.prototype.getIdRate = function() {
        return ['rate', this.getType(), this.getId()].join('_');
    }

    // type;id;count;fvalue,ivalue;canRate;isRated
    Backbone.Model.prototype.getDataRate = function() {
        return [this.getType(), this.getId(), this.getRateCount(), this.getRateFloatValue(), this.getRateValue(), this.canRate() ? 1 : 0, this.isRated() ? 1 : 0].join(';');
    }

    // type;id;count;canComment
    Backbone.Model.prototype.getDataComment = function() {
        return [this.getType(), this.getId(), this.getCommentCount(), this.canComment() ? 1 : 0].join(';');
    }

    // type;id;shareCount;canShare
    Backbone.Model.prototype.getDataShare = function() {
        return [this.getType(), this.getId(), this.getShareCount(), this.canShare() ? 1 : 0].join(';');
    }

    Backbone.Model.prototype.getDataReport = function() {
        return [this.getType(), this.getId()].join(';');
    }
    /**
     * number of view?
     */
    Backbone.Model.prototype.getViewCount = function() {
        return this.get('iTotalView') || 0;
    }

    Backbone.Model.prototype.getUrl = function() {
        return '#' + this.getType() + '/' + this.getId();
    }

    Backbone.Model.prototype.getLink = function() {
        return '<a href="' + this.getUrl() + '">' + this.getTitle() + '</a>';
    }

    Backbone.Model.prototype.getCommentUrl = function() {
        var attachments = this.get('aAttachments');
        if (attachments && attachments.length > 0 && (attachments[0].sModule == 'event' || attachments[0].sModule == 'fevent')) {
            return '#event-detail/' + attachments[0].sModule + '/' + attachments[0].iId + '/activity';
        } else {
            return this.getUrl() + '/comment' + (this.getParentModuleId() ? '/' + this.getParentModuleId() : '');
        }
    }
    /**
     * number of comment ?
     */
    Backbone.Model.prototype.getCommentCount = function() {
        return parseInt(this.get('iTotalComment') || 0, 10);
    }

    /**
     * number of share ?
     */
    Backbone.Model.prototype.getShareCount = function() {
        return this.get('iTotalShare') || 0;
    }

    Backbone.Model.prototype.getShareCountLabel = function() {
        return _t('Share');
    }

    Backbone.Model.prototype.getRateValueLabel = function() {
        return _t('%s Rating', this.getRateValue());
    }

    Backbone.Model.prototype.getProfilePageId = function() {
        return parseInt(this.get('iProfilePageId')) || 0;
    }

    Backbone.Model.prototype.getPosterId = function() {
        return this.getProfilePageId() || this.get('iUserId') || this.get('iSenderId');
    }

    Backbone.Model.prototype.getPosterType = function() {
        return this.getProfilePageId() > 0 ? 'pages' : 'user';
    }

    Backbone.Model.prototype.getPosterUrl = function() {
        return '#' + this.getPosterType() + '/' + this.getPosterId();
    }

    Backbone.Model.prototype.getPosterTitle = function(len) {
        return (this.get('sFullName') || this.get('sFullname') || this.get('sUserName'));
    }

    Backbone.Model.prototype.getPosterImageSrc = function() {
        return this.get('sUserImage') || this.get('sImage');
    }


    Backbone.Model.prototype.isOwner = function() {
        return this.getPosterId() == Backbone.iUserId; // quick fix for performance
    }

    Backbone.Model.prototype.getItemId = function() {
        return this.get('iItemId');
    }

    Backbone.Model.prototype.getItemType = function() {
        return this.get('sItemType');
    }
    Backbone.Model.prototype.getObjectId = function() {
        return this.get('iObjectId') || 0;
    }

    Backbone.Model.prototype.getObjectType = function() {
        return this.get('sObjectType') || '';
    }

    Backbone.Model.prototype.getObjectTitle = function() {
        return this.get('sObjectTitle') || '';
    }


    Backbone.Model.prototype.getObjectUrl = function() {
        return '#' + this.getObjectType() + '/' + this.getObjectId();
    }

    Backbone.Model.prototype.getObjectLink = function() {
        return '<a href="' + this.getObjectUrl() + '">' + this.getObjectTitle() + '</a>';
    }

    Backbone.Model.prototype.isNeedScroll = function() {
        return this.get('bNeedToScroll') || false;
    }

    Backbone.Model.prototype.getParentType = function() {
        return this.get('sParentType') || '';
    }

    Backbone.Model.prototype.getUserDislike = function() {
        return this.get('aUserDislike') || this.get('aDislikes');
    }

    Backbone.Model.prototype.getParentModuleId = function() {
        return this.get('parentModuleId') || '';
    }

    Backbone.Model.prototype.getSharedUserName = function() {
        return this.get('sSharedUserName') || '';
    }

    Backbone.Model.prototype.getSharedUserId = function() {
        return this.get('iSharedUserId') || 0;
    }

    Backbone.Model.prototype.getSharedUserUrl = function() {
        return '#user/' + this.getSharedUserId();
    }

    Backbone.Model.prototype.getSharedUserLink = function() {
        return '<a href="' + this.getSharedUserUrl() + '">' + this.getSharedUserName() + '</a>';
    }

    Backbone.Model.prototype.canEdit = function() {
        return this.get('bCanEdit') || false;
    }

    Backbone.Model.prototype.canDelete = function() {
        return this.get('bCanDelete') || false;
    }
    
    /**
     * add this prototype to support social share.
     */
    Backbone.Model.prototype.getSocialShareUrl =  function(){
      return constants.siteUrl + 'index.php?do=/'+this.getType()+'/'+ this.getId();
    }
});