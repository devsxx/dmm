define([
    'underscore.string'
], function(STR) {
	return Backbone.Model.extend({
		idAttribute : 'iEventId',
		defaults : {
			sModelType : 'event'
		},
		getFullTimeEnd : function() {
			return this.get('sEndFullTime');
		},
		getFullTimeStart : function() {
			return this.get('sStartFullTime');
		},
		getPosterImageSrc : function() {
			return this.get('sUserImageUrl') || '';
		},
		getShortStartTime : function() {
			return this.get('sShortStartTime') || '00:OO';
		},
		getTimezoneOffset: function () {
			return parseFloat(this.get('sUserTimezone')) || 0;
		},
		getDate : function(bEnd) {
			var local_date = bEnd ? new Date(this.getEndTime() * 1e3) : new Date(this.getStartTime() * 1e3);
			var utc_date = local_date.getTime() + (local_date.getTimezoneOffset() * 60000);
			var date = new Date(utc_date + (3600000*this.getTimezoneOffset()));

			var fullMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			var maps = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'DEC', 'NOV'];
			var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec', 'Nov'];
			var m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
			var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			var weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			var hour = date.getHours();
			var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
			var h = (hour > 12) ? (hour - 12) : (hour == 0 ? 12 : hour);
			var minute = date.getMinutes();
			var i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			var a = (hour > 11) ? "pm" : "am";
			var A = (hour > 11) ? "PM" : "AM";

			if (hour < 10) {
				hour = '0' + hour;
			}

			if (minute < 10) {
				minute = '0' + minute;
			}
			
			var returnData = {
				fullYear : date.getFullYear(),
				fullMonth : fullMonth[date.getMonth()],
				month : maps[date.getMonth()],
				M : M[date.getMonth()],
				m : m,
				d: d,
				date : date.getDate(),
				weekDay : weekDay[date.getDay()],
				D : D[date.getDay()],
				time : this.get('getShortStartTime'),
				hour : hour,
				H : H,
				h : h,
				minute : minute,
				i : i,
				a : a,
				A : A
			};

			return returnData;
		},
		getStartTime : function() {
			return this.get('iStartTime');
		},
		getTextStartTime : function() {
			var date = this.getDate();
			return date.weekDay + ", " + date.fullMonth + " " + date.date + ", " + date.fullYear + " at " + date.h + ":" + date.minute + " " + date.a;
		},
		getTextShortStartTime : function() {
			var date = this.getDate();
			return date.h + ":" + date.minute + " " + date.A;
		},
		hasDescription : function() {
			return this.get('sDescription') != '';
		},
        getShortDescription: function (len) {
            len = len || 120;
            var strippedStr = STR.stripTags(this.getDescription());
            return utils.str.shorten(strippedStr, len, false);
        },
		hasHost : function() {
			return this.get('sHost') != '';
		},
		hasLocation : function() {
			return this.get('sLocation') != '';
		},
		hasCategory : function() {
			return this.get('sCategory') != '';
		},
		getLink : function() {
			return '<a href="' + this.getUrl() + '">' + this.getName() + '</a>';
		},
		getMultualFriendCount : function() {
			return this.get('iMutualFriends');
		},
		isFriend : function() {
			return this.get('isFriend');
		},
		getLocation : function() {
			return this.get('sLocation');
		},
		getImageSrc : function() {
			return this.get('sEventImageUrl');
		},
		getBigImageSrc : function() {
			return this.get('sEventBigImageUrl');
		},
		canInvite : function() {
			return this.get('bCanInvite');
		},
		getHost : function() {
			return this.get('sHost');
		},
		getTimestamp : function() {
			return this.get('iTimeStamp');
		},
		getTotalMember : function() {
			return this.get('iNumOfMember');
		},
		getTextTotalMember : function() {
			var iNumber = this.getTotalMember();
			return iNumber + (iNumber == 1 ? " guest" : " guests");
		},
		getTotalGuest : function() {
			return this.get('aGuestStatistic').iNumAll;
		},
		getTotalGoing : function() {
			return this.get('aGuestStatistic').iNumGoing;
		},
		getTotalMaybe : function() {
			return this.get('aGuestStatistic').iNumMaybe;
		},
		getTotalNotAttend : function() {
			return this.get('aGuestStatistic').iNumNotAttending;
		},
		getGoingList : function() {
			return this.get('aGuestList').going;
		},
		getMaybeList : function() {
			return this.get('aGuestList').maybe;
		},
		getNotAttendList : function() {
			return this.get('aGuestList').notAttend;
		},
		isMember : function() {
			return this.get('bIsMember');
		},
		isResourceApproval : function() {
			return this.get('bIsResourceApproval');
		},
		isOnRequest : function() {
			return this.get('bOnRequest');
		},
		canView : function() {
			return this.get('bCanView');
		},
		getRSVP : function() {
			return this.get('iRsvp');
		},
		getEndTime : function() {
			return this.get('iEndTime');
		},
		getTextEndTime : function() {
			var date = this.getDate(true);
			return date.weekDay + ", " + date.fullMonth + " " + date.date + ", " + date.fullYear + " at " + date.h + ":" + date.minute + " " + date.a;
		},
		getCategory: function(){
			return this.get('sCategory');
		},
        getCategoryId: function () {
            return this.get('iCategory');
        },
		getCategoryOptions: function () {
			return this.get('category_options');
		},
		getViewOptions: function () {
			return this.get('view_options');
		},
		getCommentOptions: function () {
			return this.get('comment_options');
		},
		getViewPrivacy: function () {
			return this.get('sViewPrivacy');
		},
		getCommentPrivacy: function () {
			return this.get('sCommentPrivacy');
		},
        getUrl: function () {
            return '#event-detail/' + this.getType() + '/' + this.getId();
        }
	});

});
