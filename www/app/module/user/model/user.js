define(function() {

    var Model = Backbone.Model.extend({
        idAttribute: 'iUserId',
        defaults: {
            sModelType: 'user',
        }
    });

    Model.prototype.getId = function() {
        return this.get('iUserId') || this.get('user_id') || this.get('id');
    }

    Model.prototype.getUserName = function() {
        return this.get('user_name') || this.get('username');
    }

    Model.prototype.getEmail = function() {
        return this.get('email') || this.get('sEmail');
    }

    Model.prototype.getPhone = function() {
        return this.get('phone') || this.get('sPhone');
    }

    Model.prototype.getTitle = function() {
        return this.get('sFullName') || this.get('full_name') || this.get('Display_Name') || '';
    }

    Model.prototype.getAboutUrl = function() {
        return '#user-about/' + this.getId();
    }

    Model.prototype.getPhotoUrl = function() {
        return '#user-photo/' + this.getId();
    }

    Model.prototype.getFriendUrl = function() {
        return '#friends/' + this.getId();
    }

    Model.prototype.canComment = function() {
        return this.get('bCanPostComment');
    }

    Model.prototype.getImageSrc = function() {
        return this.get('UserProfileImg_Url') || this.get('profileimage') || this.get('Profile_Image') || this.get('sUserImage');
    }

    Model.prototype.getBigImageSrc = function() {
        return this.get('BigUserProfileImg_Url') || this.get('Profile_Image_Big') || this.get('sBigUserImage');
    }

    Model.prototype.isFriend = function() {
        return this.get('isFriend') ? 1 : 0;
    }


    Model.prototype.isBlocked = function() {
        return this.get('isBlocked');
    }

    Model.prototype.isBlockedBy = function() {
        return this.get('isBlockedBy');
    }

    Model.prototype.isSentRequestBy = function() {
        return this.get('isSentRequestBy') ? 1 : 0;
    }

    Model.prototype.isSentRequest = function() {
        return this.get('isSentRequest') ? 1 : 0;
    }

    Model.prototype.getBirthDate = function() {
        return this.get('sDayOfBirth') || this.get('Date_Of_Birth');
    }

    Model.prototype.getGender = function() {
        return this.get('sGender') || this.get('Gender') || '';
    }

    Model.prototype.getFriendCount = function() {
        return this.get('iTotalOfFriends');
    }

    Model.prototype.getPhotoCount = function() {
        return this.get('iTotalOfPhotos');
    }

    Model.prototype.getFirstName = function() {
        return this.get('First_Name') || this.get('first_name') || '';
    }

    Model.prototype.getLastName = function() {
        return this.get('Last_Name') || this.get('last_name') || '';
    }

    Model.prototype.getDateOfBirthYMD = function() {
        return this.get('sDateOfBirthYMD') || '';
    }

    Model.prototype.getWebsiteContact = function() {
        return this.get('aContacts') ? this.get('aContacts').website : '';
    }

    Model.prototype.getFacebookContact = function() {
        return this.get('aContacts') ? this.get('aContacts').facebook : '';
    }

    Model.prototype.getTwitterContact = function() {
        return this.get('aContacts') ? this.get('aContacts').twitter : '';
    }

    Model.prototype.getAIMContact = function() {
        return this.get('aContacts') ? this.get('aContacts').aim : '';
    }

    Model.prototype.getAboutMe = function() {
        return this.get('sAboutMe');
    }

    Model.prototype.getDataFriend = function() {
        return [this.getId(), this.isFriend(), this.isSentRequest(), this.isSentRequestBy()].join(';');
    }

    Model.prototype.canView = function() {
        return (this.get('bCanView') === void 0) ? true : this.get('bCanView');
    }

    Model.prototype.getTotalPhotos = function() {
        return this.get('iTotalPhotos') || 0;

    }

    Model.prototype.getTotalFriends = function() {
        return this.get('iTotalFriends') || 0;

    }

    Model.prototype.isMuteChatNotification = function() {
        return !localStorage.getItem('cometchat_notification') && !localStorage.getItem('chat_notification');
        // return this.get('bIsMuteChatNotification') == null ? true : this.get('bIsMuteChatNotification');
    }

    Model.prototype.isOnline = function() {
        return this.getChatStatus() == 'online' ? true : false;
    }

    Model.prototype.getChatStatus = function() {
        return this.get('sStatus') || this.get('sChatStatus') || '';
    }

    Model.prototype.getCity = function() {
        return this.get('sCity') || '';
    }

    Model.prototype.getZipPostalCode = function() {
        return this.get('sZipCode') || '';
    }

    Model.prototype.getCountryISO = function() {
        return this.get('sCountryISO') || '';
    }

    Model.prototype.getCoverPhotoUrl = function() {
        return this.get('sCoverPhotoUrl') || '';
    }

    Model.prototype.getRelationshipStatus = function() {
        return this.get('sRelationshipStatus') || '';
    }

    Model.prototype.getLocation = function() {
        return this.get('sLocation') || '';
    }
	Model.prototype.getActivityPoints = function() {
        return this.get('activity_points') || '';
    }

    Model.prototype.getChildId = function() {
        return this.get('iCountryChildId') || 0;
    }

    Model.prototype.canShareOnWall = function() {
        return this.get('bCanShareOnWall') || false;
    }

    Model.prototype.canViewFriend = function() {
        return this.get('bCanViewFriend') || false;
    }

    Model.prototype.canSendMessage = function() {
        return this.get('bCanSendMessage') || false;
    }

    Model.prototype.canViewPhoto = function() {
        return this.get('bCanViewPhoto') || false;
    }

    Model.prototype.canViewBasicInfo = function() {
        return this.get('bCanViewBasicInfo') || false;
    }

    Model.prototype.canViewProfileInfo = function() {
        return this.get('bCanViewProfileInfo') || false;
    }

    Model.prototype.canViewWall = function() {
        return this.get('bCanViewWall') || false;
    }

    return Model;
});