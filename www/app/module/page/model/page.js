define([
    'underscore.string'
], function(STR) {

    var Model = Backbone.Model.extend({
        idAttribute: 'iPageId',
        defaults: {
            sModelType: 'pages',
            bCanView: true,
            bCanShare: true,
            bCanLike: true
        }
    });

    Model.prototype.getAvatarImageSrc = function() {

        return this.get('sAvatarImage');
    }

    Model.prototype.getCoverImageSrc = function() {

        return this.get('sCoverImage');
    }

    Model.prototype.getCategoryName = function() {

        return this.get('sCategoryName') || '';
    }

    Model.prototype.getParsedText = function() {

        var sBody = this.get('sText') || '';

        return utils.helper.parseExternalLink(sBody);
    }

    Model.prototype.getText = function() {

        return this.get('sText') || '';
    }

    Model.prototype.getStrippedText = function() {

        return STR.stripTags(this.getText());
    }

    Model.prototype.getTotalMembers = function() {

        return this.get('iTotalMembers');
    }

    Model.prototype.getTotalAdmins = function() {

        return this.get('iTotalAdmins');
    }

    Model.prototype.getMemberList = function() {

        return this.get('aMembers');
    }

    Model.prototype.getMemberListMin = function() {

        var len = this.getTotalMembers() <= 18 ? this.getTotalMembers() : 17;

        return this.getMemberList().slice(0, len);
    }

    Model.prototype.getAdminList = function() {

        return this.get('aAdmins');
    }

    Model.prototype.getAdminListMin = function() {

        var len = this.getTotalAdmins() <= 18 ? this.getTotalAdmins() : 17;

        return this.getAdminList().slice(0, len);
    }

    Model.prototype.canShareBlogs = function() {

        return this.get('bCanShareBlogs') || false;
    }

    Model.prototype.canShareVideos = function() {

        return this.get('bCanShareVideos') || false;
    }

    Model.prototype.getTypeId = function() {

        return this.get('iTypeId') || 0;
    }

    Model.prototype.getCategoryId = function() {

        return this.get('iCategoryId') || 0;
    }

    Model.prototype.getCategoryOptions = function() {

        return this.get('category_options') || 0;
    }

    Model.prototype.canInvite = function() {

        return this.get('bCanInvite') || 0;
    }

    Model.prototype.isInvited = function() {

        return this.get('bIsInvited') || 0;
    }

    return Model;
});