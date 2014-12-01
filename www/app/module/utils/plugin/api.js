define(function(){
	var _defaults = {
		cache: false,
		dataType: 'json',
		type: 'POST',
		timeout: 30e3,
		data: {},
		beforeSend: function(){}
	}
	return {
		setup: function(option){
			var headers = $.extend({
				token: null
			}, option);
			
			$.ajaxSetup({headers: headers});
		},
		cometPost: function(api, data, settings){
			
			data = $.extend(data, {user_id: Backbone.iUserId});
			
			settings  = $.extend({},_defaults,{type:'POST', data: data}, settings);

            utils.debug.log('POST: ' + api + ' DATA: ', data);
	
            return $.ajax(constants.cometApiUrl + api, settings)
                // .then(function(response, status, xhr){
                    // if(response.error_code){
                        // return $.Deferred().reject(response);
                    // }
                    // return response;
                // },function(xhr, status, errorThrow){
                    // return $.Deferred().reject({
                        // error_code: 503, 
                        // error_message: status
                    // });
                // })
                .fail(this._handleFail)
                .done(!Debug || this._printResponse); // do not print if it is not debug
		},
		post: function(api, data, settings){
			
			settings  = $.extend({},_defaults,{type:'POST', data: data}, settings);

            utils.debug.log('POST: ' + api + ' DATA: ', data);
	
            return $.ajax(constants.apiUrl + api, settings)
                // .then(function(response, status, xhr){
                    // if(response.error_code){
                        // return $.Deferred().reject(response);
                    // }
                    // return response;
                // },function(xhr, status, errorThrow){
                    // return $.Deferred().reject({
                        // error_code: 503, 
                        // error_message: status
                    // });
                // })
                .fail(this._handleFail)
                .done(!Debug || this._printResponse); // do not print if it is not debug
		},
		get: function(api, data, settings){
			var url =  constants.apiUrl + api;
				
			settings  = $.extend({}, _defaults,{type:'GET', data: data}, settings);
			
			utils.debug.log('GET: ' + api + ' \nDATA: ', data); 
	
            return $.ajax.apply(null, [constants.apiUrl + api, settings])
                // .then(function(response, status, xhr){
                    // if(response.error_code){
                        // return $.Deferred().reject(response);
                    // }
                    // return response;
                // },function(xhr, status, errorThrow){
                    // return $.Deferred().reject({
                        // error_code: 503, 
                        // error_message: status
                    // });
                // })
                .fail(this._handleFail)
                .done(!Debug || this._printResponse); // do not print if it is not debug
		},
		test: function(api, data, settings){
			var url =  constants.testUrl + api;
			
			settings  = $.extend({}, _defaults,{type:'GET',data: data}, settings);
			
			return $.ajax.apply(null, [constants.apiUrl + api, settings])
				// .then(function(response, status, xhr){
					// if(response.error_code){
						// return $.Deferred().reject(response);
					// }
					// return response;
				// },function(xhr, status, errorThrow){
					// return $.Deferred().reject({
						// error_code: 503, 
						// error_message: status
					// });
				// })
				.fail(this._handleFail)
				.done(!Debug || this._printResponse); // do not print if it is not debug	
		},
		uploadVideo: function(api, videoSrc, params) {
            var self     = this
              , deffered = $.Deferred() 
              , path     = videoSrc
              , filename = path.split('/').pop()
              , mimeType = "video/quicktime"
              , options  = new FileUploadOptions()
              , ft       = new FileTransfer();

            if (constants.platform == 'android') {
                filename = path.match(/\/([^\/]+)$/)[1]  + '.mp4';
                mimeType = "video/mp4";
            }

            var params = $.extend({
                token: constants.token,
                sTitle: filename,
                search: 1
            }, params);
            //params.iSubjectId = iSubjectId;
            
            options.fileKey = "video";
            options.fileName    = filename;
            options.mimeType = mimeType;
            options.chunkedMode = false;
            options.params      = params;
            options.headers = {token: constants.token};
       		
       		utils.observer.trigger('blockui');
            utils.blockui.content(_t('Uploading 0\%, please wait ...'));

            ft.upload(
                path,
                encodeURI(constants.apiUrl + api),
                function(result) {
                    utils.observer.trigger('releaseui');
                	var data = $.parseJSON(result.response);
                    deffered.resolve(data);
                },
                function(error) { // fail
                    utils.observer.trigger('releaseui');
                    utils.modal.alert(_t('Can not upload file(s). Please try again later.'));
                    deffered.reject(error);
                },
                options
            );

            var percent_upload_file = 0;
            ft.onprogress = function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    percent_upload_file = (progressEvent.loaded * 100) / progressEvent.total;
                    utils.blockui.content(_t('Uploading %s\%, please wait', parseInt(percent_upload_file, 10)));
                }
                deffered.progress(progressEvent);
            };

            return deffered.promise();
        },
        uploadImage: function(api, imgSrc, params) {
            var self     = this
              , deffered = $.Deferred() 
              , path     = imgSrc
              , filename = ''
              , options  = new FileUploadOptions()
              , ft       = new FileTransfer();

            if(path.match(/[^\/]+.jpg$/g)){
                filename = path.match(/[^\/]+.jpg$/ig)[0];
            }else if (path.match(/id=(\w|\-)+/)){
                filename = path.match(/id=(\w|\-)+/)[0].replace('id=','')+'.jpg';
            }

            if(filename == '' && constants.platform == 'android') {
                filename = path.match(/\/([^\/]+)$/)[1]  + '.jpg'; // match the last component in list of /fdsaf/fdsaf/21321 
            }

            var params = $.extend({
                token: constants.token,
                iAlbumId: 0,
                sTitle: filename
            }, params);
            //params.iSubjectId = iSubjectId;
            
            options.fileKey     = "image";
            options.fileName    = filename;
            options.mimeType    = "image/jpeg";
            options.chunkedMode = false;
            options.params      = params;
            
            utils.observer.trigger('blockui');
            utils.blockui.content(_t('Uploading 0\%, please wait ...'));
            // $('#block_message').html('Uploading (<span id="upload_percent">0</span>%). Please wait...');


			utils.debug.log('uploading image to URL: ' + api + ' \n Params: ', params); 

            ft.upload(
                path,
                encodeURI(constants.apiUrl + api),
                function(result) { //success
                    utils.observer.trigger('releaseui');
                    var data = $.parseJSON(result.response);
                    deffered.resolve(data);
                },
                function(error) { // fail
                    utils.observer.trigger('releaseui');
                    utils.modal.alert(_t('Can not upload file(s). Please try again later.'));
                    console.log('Error upload file :' + JSON.stringify(error));
                    deffered.reject(error);
                },
                options
            );

            var percent_upload_file = 0;
            ft.onprogress = function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    percent_upload_file = (progressEvent.loaded * 100) / progressEvent.total;
                    // $('#upload_percent').html(parseInt(percent_upload_file));
                    utils.blockui.content(_t('Uploading %s\%, please wait', parseInt(percent_upload_file, 10)));
                }
                deffered.progress(progressEvent);
            };

            return deffered.promise();
        },
        //private 
		_handleFail: function(xhr, statusText, jqXHR) {
			
			if(statusText && statusText == 'abort') return ; // user canceled request
			
			utils.modal.toast(_t('Can not get data from server'));
            utils.debug.log('FAILED: ', statusText, jqXHR);
       },
        _printResponse: function(data, status, jqXHR) {
            utils.debug.log('RESPONSE: ', data);
        }
	}
});
