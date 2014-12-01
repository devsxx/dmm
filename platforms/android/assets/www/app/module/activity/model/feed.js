define([
    'activity/model/privacy',
    'core'
], function(Privacy, core) {

    var Model = Backbone.Model.extend({
        urlRoot: constants.apiURL + 'feed/get',
        idAttribute: 'iActionId',
        defaults: {
            sModelType: 'feed',
            bCanLike: true,
            bCanShare: true,
            sSubjectType: null,
            sSubjectId: null,
            sSubjectTitle: null
        }
    });


    Model.prototype.getHeadline = function() {
        return utils.headline.translate(this);
    }

    Model.prototype.getPosterLink = function(len) {
        if (!arguments.length) {
            len = 250;
        }
        return '<a class="poster-link" href="' + this.getPosterUrl() + '">' + utils.str.truncate(this.getPosterTitle(), len, false) + '</a>';
    }

    Model.prototype.getObjectLink = function(len) {
        if (!arguments.length) {
            len = 22;
        }
        return '<a class="object-link" href="' + this.getObjectUrl() + '">' + utils.str.truncate(this.getObjectTitle(), len, false) + '</a>';
    }

    Model.prototype.getItemLink = function(len) {
        if (!arguments.length) {
            len = 22;
        }
        return '<a class="item-link" href="' + this.getItemUrl() + '">' + utils.str.truncate(this.getItemTitle(), len, false) + '</a>';
    }

    Model.prototype.getParam = function() {
        return this.get('sParams') || {};
    }

    Model.prototype.getSharedItemType = function() {
        return this.get('sSharedItemType') || {};
    }

    Model.prototype.getItemId = function() {
        return this.get('iItemId');
    }

    Model.prototype.getTimestamp = function() {
        return this.get('iTimestamp');
    }

    Model.prototype.getItemType = function() {
        return this.get('sItemType');
    }

    Model.prototype.getItemTitle = function() {
        return this.get('sItemTitle');
    }

    Model.prototype.getItemUrl = function() {
        return '#' + this.getItemType() + '/' + this.getItemId();
    }


    Model.prototype.getActionType = function() {
        return this.get('sActionType');
    }

    Model.prototype.getActionId = function() {
        return this.get('iActionId');
    }

    Model.prototype.getPosterTitle = function() {
        return this.get('sFullName');
    }

    Model.prototype.getPosterImageSrc = function() {
        return this.get('UserProfileImg_Url');
    }

    Model.prototype.getParentId = function() {
        return this.get('iObjectParentId');
    }

    Model.prototype.getParentType = function() {
        return this.get('sObjectParentType');
    }

    Model.prototype.getParentTitle = function() {
        return this.get('sObjectParentTitle');
    }

    Model.prototype.getParentUrl = function() {
        return '#' + this.getParentType() + '/' + this.getParentId();
    }

    Model.prototype.getParentLink = function(len) {
        if (!arguments.length) {
            len = 22;
        }
        return '<a class="item-link" href="' + this.getParentUrl() + '">' + utils.str.truncate(this.getParentTitle(), len, false) + '</a>';
    }

    Model.prototype.getOwnerId = function() {
        return this.get('iObjectOwnerId');
    }

    Model.prototype.getOwnerType = function() {
        return this.get('sObjectOwnerType');
    }

    Model.prototype.getOwnerTitle = function() {
        return this.get('sObjectOwnerTitle');
    }

    Model.prototype.getOwnerUrl = function() {
        return '#' + this.getOwnerType() + '/' + this.getOwnerId();
    }

    Model.prototype.getOwnerLink = function(len) {
        if (!arguments.length) {
            len = 22;
        }
        return '<a class="item-link" href="' + this.getOwnerUrl() + '">' + utils.str.truncate(this.getOwnerTitle(), len, false) + '</a>';
    }

    Model.prototype.hasStory = function() {
        return this.get('sContent') || this.get('sParams').body;
    }

    Model.prototype.getStory = function() {
        var sStory = this.get('sFullContent') || this.get('sContent') || this.get('sParams').body;
        if (sStory) {
            return sStory.replace(/\[x=(\d+)\]([^\[]+)\[\/x\]/ig, '<a href="#user/$1">$2</a>');
        }
        return sStory;
    }

    Model.prototype.getAttachments = function() {
        return this.get('aAttachments');
    }

    /**
     * get attacment type if exists
     * @return string|false
     */
    Model.prototype.getAttachmentType = function() {
        if (!this.hasAttachment()) {
            return false;
        }
        return this.get('aAttachments')[0].sType;
    }

    /**
     * feed has attachments?
     * @return bool
     */
    Model.prototype.hasAttachment = function() {

        if (!this.get('aAttachments')) {
            return false;
        }

        if (!this.get('aAttachments').length) {
            return false;
        }

        return true;
    }

    Model.prototype.getAttachmentCount = function() {
        if (this.get('aAttachments')) {
            return 0;
        }
        return this.get('aAttachments').length;
    }

    Model.prototype.canDelete = function() {
        return this.get('bCanDelete') || this.isOwner() || (this.get('sItemType') == 'user' && this.get('iItemId') == Backbone.iUserId) || (this.hasParentUser() && this.get('iObjectParentId') == Backbone.iUserId);
    }

    Model.prototype.getTimezoneOffset = function() {
        return parseFloat(this.get('sUserTimezone')) || 0;
    }

    Model.prototype.getPrivacyValue = function() {
        return parseInt(this.get('iPrivacy'), 10) || 0;
    }

    Model.prototype.getPrivacyClass = function() {
        var privacy = new Privacy({
            sValue: this.getPrivacyValue()
        });
        return privacy.getClass();
    }

    Model.prototype.getParentModuleId = function() {
        return this.get('parentModuleId') || '';
    }

    Model.prototype.hasParentUser = function() {

        if (this.getParentModuleId() == 'event' || this.getParentModuleId() == 'fevent') { // currently, data of event feed is wrong parent
            return false;
        }

        return this.getParentTitle() && this.getParentId();
    }

    Model.prototype.getServerHeadLine = function() {

        var sHeadLine = this.get('sHeadLine') || '';

        if (sHeadLine) {
            return sHeadLine.replace(/\[x=(\d+)\]([^\[]+)\[\/x\]/ig, '<a href="#user/$1">$2</a>');
        }

        return sHeadLine;
    }
    
    Model.prototype.getSocialShareUrl = function(){
       if(this.hasAttachment()){
                 
           var item =  this.get('aAttachments')[0];
          
           if(item.hasOwnProperty('sLink_Url'))
             return item.sLink_Url;
           
           if(item.hasOwnProperty('sType') && item.hasOwnProperty('iId'))
                return constants.siteUrl + 'index.php?do=/'+item.sType+'/'+ item.iId;
        }
       
       return this.getItemUrl();
    }

    return Model;
});