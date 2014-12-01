define([
    'underscore.string'
], function(STR){
	return Backbone.Model.extend({
		idAttribute: 'iCommentId',
		defaults: {
			sModelType     : 'core_comment', // defined by socialengine if is activity_action or is activity_comment.
            // represent what server returns
            UserLike       : [],
            bIsLiked       : false,
            iCommentId     : 0,
            iItemId        : 0,
            iTotalComment  : 0,
            iTotalLike     : 0,
            iUserId        : 0,
            sContent       : '',
            sFullName      : '',
            sImage         : '',
            sItemType      : '',
            sModelType     : '',
            sTime          : '',
            sTimeConverted : ''
		},
		getContent: function(){
			var sContent = this.get('sContent');
            if (sContent) {
                return STR.stripTags(sContent);
            }
            return sContent;
		},
        getItemId: function () {
            return this.get('iItemId');
        },
		getLikeLabel: function () {
			var text = '';
			var count = this.getLikeCount();
			if (count > 0) {
				text += count + ' ';
			}
			return text + (count > 1 ? _t('likes') : _t('like'));
		},
		getDislikeLabel: function () {
			var text = '';
			var count = this.getDislikeCount();
			if (count > 0) {
				text += count + ' ';
			}
			return text + (count > 1 ? _t('dislikes') : _t('dislike'));
		},
        canDislike: function () {
            return utils.setting.get('like_allow_dislike') || false;
        }
	});
});
