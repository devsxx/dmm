define(function () {

	return {
		fileSystem : null,
		ready : false,
		mimes: {
		  'js':'text/plain',
		  'json':'text/plain',
		  'jpg':'image/jpg',
		  'gif':'image/gif',
		  'png':'image/png',
		  'css':'text/plain'
		},
		initializer : function () {
			var self = this;
			self.cache_root = "com.doemyanmar.2014";
			self.storage_size = 10 * 1024 * 1024; // 10MB

			window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

			/**
			* Initialize cordova file system
			**/
			if(window.requestFileSystem){


					if(window.webkitStorageInfo){
						window.webkitStorageInfo.requestQuota(window.PERSISTENT, self.storage_size, function (grantedBytes){
								console.log('FS: Requested '+grantedBytes+' bytes');
							window.requestFileSystem(window.PERSISTENT, grantedBytes, function(fs){
								self.fileSystem = fs;
								self.ready  = true;
							},function(err){
							    console.log("Could not use fileSystem!");
							    self.ready  = true;
						    });
						});
					}

			}else if (constants.platform==="ios"||constants.platform==="android"){
                   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
                   	  self.fileSystem = fs;
                   	
                   	  self.initFileSystem(function(){
                   	  	  self.ready = true;

                   	  });
                   },function (err){
                   	console.log("Could not use file system!");
                   	self.ready = true;
                   });

			}else {
				self.ready = true;
			}
		},

		createDirectory : function (rootDirEntry, folders, callback) {
			 var self = this;
			 if(folders[0]=='.'||folders[0]==''){
			 	folders.shift();
			 }
			 if(folders.length > 0){
			 	
			 }
		},
		getFileSystemURI: function () {

		},
		initFileSystem: function (callback) {
			var self = this,
			    fs   = self.fileSystem;
			    callback = callback || function () {}; 
			    self.createDirectory(fs.root, self.cache_root.split('/'), function () {
			    	callback();
			    });
		}
	};
});