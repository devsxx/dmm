define([
	'text!core/tpl/partial-updater.html'
],function(text){
	
	var  Updater = Backbone.Model.extend({
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
				this.set(data);
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
	})
	
	Updater.prototype.updateView = function(){
		var $request = $('#beeber-request-counter'),
			$message  = $('#beeber-message-counter'),
			$notification = $('#beeber-notification-counter'),
			iNotificaaton = this.getNumberNotification(),
			iRequest = this.getNumberRequest(),
			iMessage = this.getNumberMessage()
			;
					
		if($request.length){
			if(iRequest >0 ){
				$request.html(iRequest).removeClass('hide');
			}else{
				$request.addClass('hide');
			}
		}
		
		if($message.length){
			if(iMessage >0 ){
				$message.html(iMessage).removeClass('hide');
			}else{
				$message.addClass('hide');
			}
		}
		
		if($notification.length){
			if(iNotificaaton >0){
				$notification.html(iNotificaaton).removeClass('hide');
			}else{
				$notification.addClass('hide');
			}
		}
	}

	// code  here.
	Updater.prototype.doRegistrationWithAPNs = function(){
		var data = {
			"badge": "true",
            "sound": "true",
            "alert": "true",
            "ecb": "onAPNsReceiver"
		};

		if(constants.token){
			try {
	            var pushNotification = window.plugins.pushNotification;
	            pushNotification.register(
	            	function(result){
	            		utils.debug.log(result);
	            		utils.api.post('device/register',{
	            			"sDeviceId": result,
                			"sPlatform": constants.applePushPlatformName
	            		})
	            		.done(function(){utils.debug.log("PUSH-NOTIFICATION: Has registed device id with server.");})
	            		.fail(function(){utils.debug.log("PUSH-NOTIFICATION: Register device id is failed.");});
	            	}
                  ,function(ex){utils.debug.log("PUSH-NOTIFICATION: Cannot register device with APPLE."); utils.debug.log(ex);}
	            	, data);
	        } catch (err) {
	            // utils.modal.alert(err.message);
	        }
		}
	}

    Updater.prototype.doRegistrationWithGCM = function(){
        var data = {
            "senderID": constants.googleCloudMessageSenderId, // Project Number
            "ecb": "onGCMReceiver"
        };

        if(constants.token){
            try {
                var pushNotification = window.plugins.pushNotification;
                pushNotification.register(
                    function(result){
                        utils.debug.log(result);
                    },
                    function(ex){
                        utils.debug.log("PUSH-NOTIFICATION: Cannot register device with GOOGLE.");
                    },
                    data
                );
            } catch (err) {
                // utils.modal.alert(err.message);
            }
        }
    }

	/*
	*	The function is actived whenever phone receives a push message from server
	*/
	Updater.prototype.onAPNsReceiver = function(payload){
		utils.debug.log('RECEIVER PAYLOAD WITH DATA PAYLOAD');
		if (1 == payload.foreground) {
	        updater.fetchData(payload);
	    } else {
	        updater.gotoDetailPage(payload);
	    }
	}

    Updater.prototype.onGCMReceiver = function(e){
        switch(e.event) {
            case 'registered':
                utils.debug.log('GCM RECEIVER - registered');
                if (e.regid.length > 0) {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    utils.api.post('device/register', {
                        "sDeviceId": e.regid,
                        "sPlatform": 'android'
                    }).done(function () {
                        utils.debug.log("GCM RECEIVER - Has registed device id with server.");
                    }).fail(function () {
                        utils.debug.log("GCM RECEIVER - Register device id is failed.");
                    });
                }
                break;

            case 'message':
                utils.debug.log('GCM RECEIVER - message');
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                if (e.foreground) {
                    // if the notification contains a soundname, play it.
                    // var my_media = new Media("/android_asset/www/"+e.soundname);
                    // my_media.play();
                    updater.fetchData(e.payload);
                } else {
                    // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart) {
                        utils.debug.log('GCM RECEIVER - COLDSTART NOTIFICATION');
                        updater.fetchData(e.payload);
                    } else {
                        updater.gotoDetailPage(e.payload);
                    }
                }
                break;

            case 'error':
                utils.debug.log('GCM RECEIVER - ERROR:' + e.msg);
                break;

            default:
                utils.debug.log('GCM RECEIVER - Unknown, an event was received and we do not know what it is');
                break;
        }
    }
	
	/*
	*	Get the detail of Notification thereafter forward to detail of feed/object page.
	*/
	Updater.prototype.gotoDetailPage = function(payload){

        if (payload.sType == 'notification') {
            utils.api.post('notification/detail',{
        		"iNotificationId": payload.iId,
        	})
        	.done(function(notification){
                if (notification.sType == "commented") {
                    if (notification.sItemType == "music_playlist") {
                        window.location.href = "#music_playlist/" + notification.iItemId;
                    } else if (notification.sItemType == "activity_action") {
                        window.location.href = "#activity_action/" + notification.iItemId;
                    } else if (notification.sItemType == "album_photo") {
                        // window.location.href = "#photoDetail/" + notification.iItemId;
                    } else if (notification.sItemType == "album") {
                        window.location.href = "#albums-of/" + notification.iItemId;
                    } else if (notification.sItemType == "video") {
                        window.location.href = "#video/" + notification.iItemId;
                    }
                } else if (notification.sType == "liked_commented") {
                    if (notification.sItemType == "activity_action") {
                        window.location.href = "#activity_action/" + notification.iItemId;
                    }
                } else if (notification.sType == "liked") {
                    if (notification.sItemType == "music_playlist") {
                        window.location.href = "#music_playlist/" + notification.iItemId;
                    } else if (notification.sItemType == "album_photo") {
                        // window.location.href = "#photoDetail/" + notification.iItemId;
                    } else if (notification.sItemType == "album") {
                        window.location.href = "#albums-of/" + notification.iItemId;
                    } else if (notification.sItemType == "activity_action") {
                        window.location.href = "#activity_action/" + notification.iItemId;
                    } else if (notification.sItemType == "video") {
                        window.location.href = "#video/" + notification.iItemId;
                    } else if (notification.sItemType == "activity_comment") {
                        window.location.href = "#activity_action/" + notification.iItemId;
                    }
                } else if (notification.sType == "post_user") {
                    if (notification.sItemType == "user") {
                        window.location.href = "#user/" + notification.iItemId;
                    }
                } else if (notification.sType == "friend_accepted") {
                    window.location.href = "#user/" + notification.iOwnerUserId;
                } else if (notification.sType == "event_invite") {
                    window.location.href = "#event/" + notification.iItemId;
                }
        	})
        	.fail(function(){
        		return;
        	});
            
        }
    }

	utils.observer.on('user:login',function(){
		updater.fetchData();
	});
	
	utils.observer.on('user:logout',function(){
		updater.clearCache();
	});

	utils.observer.on('user:login',function(){
		if (constants.platform == 'android') {
            updater.doRegistrationWithGCM();
        } else {
            updater.doRegistrationWithAPNs();
        }
	});
	
	var updater = new Updater();
	
	var tpl = _.template(text);
	
	utils.helper.updater = function(){
		return tpl({
			iRequest: updater.getNumberRequest(), 
			iMessage: updater.getNumberMessage(), 
			iNotification: updater.getNumberNotification()
		});
	}
	
	window.onAPNsReceiver = function(){
		updater.onAPNsReceiver.apply(updater, arguments);
	}

    window.onGCMReceiver = function(){
        updater.onGCMReceiver.apply(updater, arguments);
    }
	
	// use push notification instead.
	window.setInterval(function(){
		// check network status before request update.
		updater.fetchData();
	}, 60 * 1e3);
	
	return updater;
});
