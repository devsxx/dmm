define([
	'activity/view/attachment-checkin'
],function(AttachmentCheckinView){
	
	utils.attachment.add(['ynmobile_map'],AttachmentCheckinView);

	utils.headline.add(['ynmobile_checkin'], function(item){
        if(item.hasAttachment()) {
            return _t('has checked in - at ') + '<span class="feed-location-name">' + item.getAttachments()[0].sLocationName + '</span>';
        } else {
            return '';
        }
	});
	
});
