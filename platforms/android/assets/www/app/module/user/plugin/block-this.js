define([
],function(core, ReportThisView){
	
	utils.observer.on('user:block-this', function($ele, evt){
		var id = $ele.data('id')
          , isBlocked = $ele.data('is-blocked')

          // if is blocked -> need to unblock and vice versa 
          , message = isBlocked ? 'Do you want to un-block this member' : 'Do you want to block this member'
          

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
        	utils.popup.close();
        	
            utils.observer.trigger('user:block-done', {
                iItemId: id,
                isBlocked: isBlocked ? false : true //new state is in contrast with previous state
            });

            utils.modal.toast(isBlocked ? 'Un-block successfully' : 'Block successfully');

        }

        if(!$ele.isProcessing()) {
            utils.modal.confirm(message, function(result) {
                if(result === 1) {
                    var data = {
                            iUserId: id
                        }
                      , settings = {
                            'beforeSend': beforeSend
                        }
                      , api = isBlocked ? 'user/unblock' : 'user/block' 


                    utils.api.post(api, data, settings).done(postDone).always(postComplete);
                }

            }, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
        } else {
            utils.modal.info('Item is processing');
        }
	});
});

