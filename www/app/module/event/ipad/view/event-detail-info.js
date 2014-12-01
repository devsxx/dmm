define(function(){
	return {
		fetchData: function(){
        	
        	var sendData  = {
                iEventId: this.model.getId(),
                iAmountOfMember: 10
            };
        	
			utils.api.get('event/detail', sendData, {context: this})
			.done(this.fetchDataComplete)
			.fail(this.fetchDataFail);
        }
	};
});
