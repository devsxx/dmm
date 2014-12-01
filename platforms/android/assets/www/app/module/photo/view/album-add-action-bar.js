define([
	'text!photo/tpl/album-add-action-bar.html'
], function(text, textForm, ItemView) {
	
	return Backbone.View.extend({
		region:{
			main: '#main',
			content: '#content',
			photo_list: '#photo_upload_list',
			edit_form: '#photo-album-edit'
		},

		template : _.template(text),
		
		templateForm: _.template(textForm),
		render : function(context) {
			
			this.context = $.extend({
				iAlbumId: 0,
				typeForm: null,
				sPhotoListId: null
			}, context);
			
			this.$el.html(this.template(this.context));
			
			return this;
			
		}
        
		,inject: function(){
			var main = $(this.region.main);
			
			main.html(this.el);
			
			var content = $(this.region.content);
			
			// Change title & Fetch data
			if(this.context.typeForm == 'edit') {
				this.loadAlbumDetail();
				this.addPhotoOfEditingAlbum();
			}else{
				this.loadPrvAndCat();
			}

			// content.vscroll();
				
			// content.trigger('refresh');
		},

		events:{
			"click #save_btn": "createAlbum",
			"click #album_form_photo_capture": "capturePhoto",
			"click #album_form_photo_browse": "browsePhoto",
			"click .close_button": "deletePhoto"
		}

		,addPhotoOfEditingAlbum: function(){
			var self = this;

			utils.api.get('photo/listalbumphoto',{
				iAlbumId: this.context.iAlbumId
				, iAmountOfPhoto: 999
			})
			
			.done(function(data){
				if(!data.length) return;
				_.each(data, function(item){
					self.addPhotoItem(item.iPhotoId, item.sPhotoUrl);
				});
			})

			.fail(function(){
				utils.debug.log(arguments);
			});
		}

		,loadPrvAndCat: function(title, description){
			var self = this;

			// Get/add list of category and privacy
			utils.api.get('photo/formadd',{})
			.done(function(data){
				if (null != data.error_code && 0 != data.error_code) {
					utils.modal.alert(data.error_message);
					window.history.back();
					return;
				}

				if(title){
					data.sTitle = title;
					data.sDescription = description;
				}

				var html  = self.templateForm({data: data});
			
				var main = $('#photo-album-edit');
				
				main.html(html);
				
			})
			.fail(function(){
				utils.debug.log(arguments);
				self.html  = self.templateForm({
					iAlbumId: null,
					sDescription: null,
					sTitle: null
				});
			});
		}

		,loadAlbumDetail: function(){
			var self = this;

			utils.api.get("photo/albumview", {
				iAlbumId: this.context.iAlbumId
			})

			.done(function(data){
				self.context = $.extend({}, data);
				$(self.el).html(self.template(self.context));
				$('.header-center',self.el).find('div.title').text("Edit Album");
				self.loadPrvAndCat(data.sTitle, data.sDescription);
			})
			
			.fail(function(data){
				utils.debug.log(arguments);
			});
		}

		,createAlbum: function(){
			if ($('#save_btn').hasClass("processing")) {
				return;
			}

			this.context.sTitle = $('#sTitle').val();
			this.context.sDescription = $('#sDescription').val();
			this.context.iCategoryId = $('#category_select').val();
			this.context.sAuthView = $('#iPrivacy').val()  || "everyone";
			this.context.sAuthComment = $('#iPrivacyComment').val()  || "everyone";

			// validate
			if (!this.context.sTitle) {
				utils.modal.alert("Please enter Album name.");
				return;
			}

			var self = this;

			// Create album
			utils.api.get((this.context.typeForm == 'create') ? 'photo/albumcreate' : 'photo/albumedit',{
				sTitle: this.context.sTitle
				, sDescription: this.context.sDescription
				, iCategoryId: this.context.iCategoryId
				, sAuthView: this.context.sAuthView
                , sAuthComment: this.context.sAuthComment
                , iAlbumId: this.context.iAlbumId
			})
			.done(function(data){

				if (null != data.error_code && 0 != data.error_code) {
					utils.modal.alert(data.error_message);
					window.history.back();
					return;
				}

				var totalPhotos = $(self.region.photo_list+" li").size();;
				self.context.iAlbumId = data.iAlbumId;
				self.uploadPhotos(0, totalPhotos);
			})
			.fail(function(arguments){
				utils.debug.log(arguments);
			});

		}

		,uploadPhotos: function(index, total){
			var photoUploadList = $('#photo_upload_list li:eq('+index+')');
			
			var path = photoUploadList.find("span.attachment-photo-image").data('src');
			
			var photoid = photoUploadList.find("span.attachment-photo-image").data('photoid');

			var self = this;
			
			if(photoid == 0){

				utils.api.uploadImage("photo/upload", path, {iAlbumId: this.context.iAlbumId}).done(function(result){
					utils.debug.log("Respond Upload Photo: "+JSON.stringify(result) + " : " +index);
					self.context.sPhotoListId += "," + result.iPhotoId;
					if ((index + 1) >= total ) {
						self.createFeed();
		            }
		            else {
		                self.uploadPhotos((index+1), total);
		            }
				});

			}else{
				if ((index + 1) >= total ) {
						self.createFeed();
		            }
		            else {
		                self.uploadPhotos((index+1), total);
		            }
			} 
		}

		,createFeed: function(){
			var params;
			if(this.context.sPhotoListId == null){
				return;
			}

			params = {
				sPhotoIds: this.context.sPhotoListId
               	, iAlbumId: this.context.iAlbumId	
			}		

			utils.api.get('photo/postfeed',params)
			.done(function(data){

				if (null != data.error_code && 0 != data.error_code) {
					utils.modal.alert(data.error_message);
					window.history.back();
					return;
				}

				utils.modal.toast('You have created successfully album!');
				window.history.back();
				
			})
			.fail(function(arguments){
				utils.debug.log(arguments);
				//utils.modal.alert(data.error_message);
			});
		}
        
        ,addPhotoItem: function(photoid, path){
        
        	var photo_list = $('#photo_upload_list');

			var inject  = function(dom){
            	photo_list.append(dom);
            }

            new ItemView().render({
                PhotoId: photoid,
                ImgSrc: path
            }).inject(inject);
	            
            var content = $(this.region.content);
            
            content.trigger('refresh');
        }
        
	    ,capturePhoto: function(){
        
        	var self = this;
            
	    	navigator.device.captureImage(onSuccess, onFail, {
	            quality: 50,
	            destinationType: destinationType.DATA_URL,
	            encodingType: Camera.EncodingType.JPEG,
	            mediaType: Camera.MediaType.PICTURE,
	            correctOrientation: true
	        });
	        
	        function onSuccess(mediaFiles) {
	        	var imageURI = mediaFiles[0].fullPath;
	        	self.addPhotoItem(0, imageURI);
	        }
	        
	        function onFail(msg) {
	            var content = $(self.region.content);
	            content.trigger('refresh');
	        }
	    }
        
	    ,browsePhoto: function(){
        	
            var self = this;
        
	    	navigator.camera.getPicture(onSuccess, onFail, {
	            quality: 50,
	            destinationType: Camera.DestinationType.FILE_URI,
	            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	            encodingType: Camera.EncodingType.JPEG,
	            correctOrientation: true
	        });
	        
	        function onSuccess(imageURI) {
	            self.addPhotoItem(0, imageURI);
	        }
	        
	        function onFail(msg) {
	            var content = $(self.region.content);
	            content.trigger('refresh');
	        }
	    }
        
        ,deletePhoto: function(event) {
			var el = $(event.target).parents('.ynphoto_upload_item');
	        // var photoId = $(event.target).data('photoid') || 0;
	        var photoId = $(event.target).find('#remove_att').data('photoid') || 0;

	        if (photoId) {
	            var jData = {iPhotoId: photoId };

	            utils.modal.confirm('Are you sure to delete this photo? (*Note: This action cannot rollback)', function(confirm) {
	                if (confirm == 1) {
	                	el.remove();
	                	utils.api.get("photo/delete", jData)
		     		    .done(function(data){
				        	utils.modal.toast("The photo has been deleted successfully.");
				        })
				        .fail(function(data){
				        	utils.debug.log(arguments);
				        });
	                }
	            }, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
	        }
	        else {
	            utils.modal.confirm('Are you sure to delete this photo? (*Note: This action cannot rollback)', function(confirm) {
	                if (confirm == 1) {
	                    el.remove();
	                    var totalAdded = window.localStorage.getItem('album.totalAdded') || 0;
	                    if (totalAdded > 0) {
	                        totalAdded --;
	                        window.localStorage.setItem('album.totalAdded', totalAdded);
	                    }
	                }
	            }, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
	        }
	    }
	});
});
