define([
	'text!photo/tpl/photo-detail-action.html',
	'comment/view/comment-page',
    'photo/view/photo-detail-setting',
    'photo/view/photo-edit',
],function(text, CommentView, SettingView){

	return Backbone.ItemView.extend({
		region: {
			holder: '#photo_detail_action_view_holder'
		},
		events: {
			'edit': 'onEditClick',
            'makeProfile': 'onMakePhotoProfileClick'
		},
		template: _.template(text),
		settingView: SettingView,
		editView: require('photo/view/photo-edit'),
		render: function(){
			
			this.$processingStatus = this.$el.find('.processing-status');
			
			this.$holder =  $('#photo_detail_action_view_holder');
			
			this.$el.html(this.template({item: this.model}));
			
			this.$el.prop('id', this.model.getDataId());

            this.model.on('change', this.updateView, this);
			
			return this;
		},
		inject: function(){
			
			this.$holder.html(this.$el);
			
			return this;
		},
		updateView: function(){
			
			this.$el.html(this.template({item: this.model}));
			
			return this;
		},
		onEditClick: function() {
            new this.editView({model: this.model}).render().inject();
        },

        doDeleteConfirm: function() {
        	
            if(this.$processingStatus.isProcessing()) return;

            var self = this;
            var msg = _t('Do you want to delete this photo');
            utils.modal.confirm(msg, function(select) {
                if(select == 1) {
            		self.doDelete();
                }
            });
        },
        doDelete: function(){
        	
            var data = {
                iPhotoId: this.model.getId(),
                iItemId: this.model.getId(),
                sItemType: this.model.getType(),
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSendDelete
            };

            utils.api.post('photo/delete', data, settings).done(this.postDeleteDone).always(this.postDeleteComplete);
        	
        },
        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postDeleteComplete: function() {
            this.$processingStatus.isProcessing(false);
            this.$processingStatus.html('');
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSendDelete: function() {
            this.$processingStatus.isProcessing(true);
            this.$processingStatus.html('Deleting...');
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDeleteDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postDeleteSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postDeleteSuccess: function (data) {
            utils.popup.close();
            utils.modal.toast(_t('Photo deleted successfully'));
            utils.history.back();
        },
        
        onMakePhotoProfileClick: function() {
            if(this.$processingStatus.isProcessing()) return;

			var msg = _t('Do you want to make this photo your profile photo');
            var self = this;
            
            utils.modal.confirm(msg, function(select) {
                if(select == 1) {
                    self.doMakeProfilePhoto();
                }
            });

        },
        
        doMakeProfilePhoto: function(){
        	var data = {
                iPhotoId: this.model.getId(),
                iItemId: this.model.getId(),
                sItemType: this.model.getType(),
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSendMakeProfile
            };

            utils.api.post('photo/setprofile', data, settings).done(this.postMakeProfileDone).always(this.postMakeProfileComplete);	
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postMakeProfileComplete: function() {
            this.$processingStatus.isProcessing(false);
            this.$processingStatus.html('');
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSendMakeProfile: function() {
            this.$processingStatus.isProcessing(true);
            this.$processingStatus.html('Setting profile...');
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postMakeProfileDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postMakeProfileSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postMakeProfileSuccess: function (data) {
            utils.popup.close();
            utils.modal.toast(_t('Set as profile photo successfully'));
            utils.observer.trigger('user:update');
        },
	});
});
