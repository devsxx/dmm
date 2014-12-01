define([
],function(core, ReportThisView){
	
	utils.observer.on('friend:friend-action', function($ele, evt){
		var friendData      = $ele.data('friend')
		  , parts           = friendData.split(';')
          , id              = parseInt(parts[0], 10)
          , isFriend        = parseInt(parts[1], 10)
          , isSentRequest   = parseInt(parts[2], 10)
          , isSentRequestBy = parseInt(parts[3], 10)
          , choices         = ['OK', 'Cancel']
          , OKPosition      = 1
          , CancelPosition  = 2
          , RejectPosition  = 3
          , action
          , api
          , consequenceIsFriend
          , consequenceIsSentRequest
          , consequenceIsSentRequestBy

        /**
        * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
        */
        var postComplete = function() {
            $ele.isProcessing(false);
        }

        /**
        * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
        */
        var beforeSend = function() {
            $ele.isProcessing(true);
        };

        /**
        * It is called when having a response returned.
        * Note that it will not be called if server returns status !== 200
        */
        var postDone = function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                postSuccess(data);
            }
        }

        /** 
        * It should be called when the response has error_code == 0 
        */
        var postSuccess = function (data) {
            utils.observer.trigger('friend:action-done', {
                iItemId: id,
                isFriend: consequenceIsFriend,
                isSentRequest: consequenceIsSentRequest,
                isSentRequestBy: consequenceIsSentRequestBy
            });

            utils.modal.toast('Action completed');
            utils.popup.close();
        }


        if(isFriend) {
            // -> unfriend
            api = 'friend/delete';
            message = 'Do you want to remove this member from your friend list?';
            consequenceIsFriend =  false;
            consequenceIsSentRequest = false;
            consequenceIsSentRequestBy = false;

        } else {
            if(isSentRequest) {
                //cancel friend request
                api = 'friend/cancelrequest';
                message = 'Do you want to cancel friend request to this member?';
                consequenceIsFriend =  false;
                consequenceIsSentRequest = false;
                consequenceIsSentRequestBy = false;
            } else {
                if(isSentRequestBy) {
                    // confirm
                    choices = ['Accept', 'Reject', 'Cancel'];
                    OKPosition = 1;
                    RejectPosition = 2;
                    CancelPosition = 3;
                    
                    // deny case handled after confirmed
                    api = 'friend/confirm'; 
                    message = 'Do you want to confirm this friend request?';
                    consequenceIsFriend =  true;
                    consequenceIsSentRequest = false;
                    consequenceIsSentRequestBy = false;

                } else {
                    // add-friend
                    api = 'friend/add';
                    message = 'Do you want to add this member to your friend list?';
                    consequenceIsFriend =  false;
                    consequenceIsSentRequest = true;
                    consequenceIsSentRequestBy = false;
                }
            }
        }

        if(!$ele.isProcessing()) {
            utils.modal.confirm(message, function(result) {
                var data = {
                        iUserId: id
                    }
                  , settings = {
                        'beforeSend': beforeSend
                    };
                    
                if(result == CancelPosition) {
                    // do nothing 
                } else if(result === OKPosition) {

                    utils.api.post(api, data, settings).done(postDone).always(postComplete);
                } else if(result === RejectPosition ) {

                    consequenceIsFriend        = false;
                    consequenceIsSentRequest   = false;
                    consequenceIsSentRequestBy = false;
                    api                        = 'friend/deny';

                    utils.api.post(api, data, settings).done(postDone).always(postComplete);

                }

            }, _t('Confirm'), choices);
        } else {
            utils.modal.info('Item is processing');
        }
	});
});


