define(function(){
	return {
	    postRSVP: function (evt, data) {
            var postData = {
                iEventId: this.model.getId(),
                iRsvp: data.rsvp,
                iAmountOfMember: 10
            };
            
            this.$rsvpHolder.addClass('hide');
            this.$rsvpBtn.removeClass('active');
            
            utils.popup.close();
            
            this.$rsvpBtn.addClass('processing');
            
            utils.api.post('event/addrsvp', postData, {context: this})
            .done(this.postRSVPComplete)
            .fail(this.postRSVPFail);
        },
        updateNumberOfMemberCount: function () {
        	this.$el.find('.num-total-member').text(this.model.getTotalMember());
        }
	};
});
