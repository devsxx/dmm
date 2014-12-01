define(function(){
	return Backbone.Model.extend({
		defaults: {
			iNumberNotification: 0,
			iNumberOfMessage: 0,
			iNumberOfFriendRequest: 0,
			iLastUpdate: 0,
			iSidebarCounter: 0,
			iSettingCounter: 0
		},
		getNumberNotification: function(){
			return this.get('iNumberNotification') || 0;
		},
		getNumberMessage: function(){
			return this.get('iNumberOfMessage') || 0;
		},
		getNumberRequest: function(){
			return this.get('iNumberOfFriendRequest') || 0;
		},
		fetchData: function(){
			utils.api.get('notification/update',{},{context: this})
			.done(this.fetchDataComplete)
			.fail(this.fetchDataFail)
			;
		},
		fetchDataComplete: function(data){
			if(data.error_code && data.error_code){
				return ;
			}else{
				this.model.set(data);
				this.updateView();
			}
		},
		fetchDataFail: function(){
			// silent
		},
		setNumberNewNotification: function(number){
			this.set('iNumberNotification',number);
		},
		setNumberNewMessage: function(number){
			this.set('iNumberOfMessage',number);
		}, setNumberNewRequest: function(number){
			this.set('iNumberOfFriendRequest',number);
		},
		clearCache: function(){
			localStorage.setItem('core.updater','');
		},
	});
});
