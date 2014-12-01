define([
    'underscore.string',
	'text!event/tpl/attachment-event.html'
],function(STR, text){
	
	return Backbone.View.extend({
		region: {},
		className: 'attachment-event',
		template: _.template(text),
		render: function(){
			
			var item = this.model;
			var att = item.getAttachments()[0];

            // use user setting timezone returned from server
            var local_date = new Date(att.iStartTime * 1e3);
            var utc_date = local_date.getTime() + (local_date.getTimezoneOffset() * 60000);
            var date = new Date(utc_date + (3600000*item.getTimezoneOffset()));

			var maps = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','DEC','NOV'];
			var hour = date.getHours();
			var minute = date.getMinutes();
			
			if(hour < 10){
				hour = '0' + hour;
			}
			
			if(minute < 10){
				minute = '0' + minute;
			}
            
            var shortDescription = '';
            if (att.sDescription) {
                var strippedStr = STR.stripTags(att.sDescription);
                shortDescription = utils.str.shorten(strippedStr, 120, false);
            }
			
			var context = {
				item: item,
				attachment: att,
				month: maps[date.getMonth()],
				day: date.getDate(),
				time:  hour+':' + minute,
                totalGuest: att.iTotalGuest + ' ' + (att.iTotalGuest == 1 ? _t('guest') : _t('guests')),
                shortDescription: shortDescription,
				attUrl: '#event-detail/' + att.sType + '/' + att.iId
			};
			
			this.$el.html(this.template(context));
			
			return this;
		},
		inject: function(dom){
			dom.html(this.el);
		}
	});
});
