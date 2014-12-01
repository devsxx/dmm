define([
	'text!video/tpl/video-edit.html',
	'text!video/tpl/video-edit-update.html'
], function(text, textUpdate) {

	return Backbone.View.extend({
		region : {
			holder : '#main',
			scroller : '#content',
			updateHolder: '#video-edit'
		},
		events : {
			"click #save_btn" : "saveVideo"
		},
		className : 'video-add',
		template : _.template(text),
		templateUpdate: _.template(textUpdate),
		// Render HTML page
		render : function(context) {

			this.$el.html(this.template({
				item: this.model
			}));
			
			this.$holder = $(this.region.holder);
			
			this.$scroller  = this.$el.find(this.region.scroller);

			this.$saveBtn = this.$el.find('#save_btn');
			
			this.$updateHolder =  this.$el.find(this.region.updateHolder);
			
			this.$videoTitleInput = this.$el.find('#ftitle');

			return this;
		},
		inject : function() {
			
			this.$holder.html(this.$el);
			
			this.$scroller.ensureVerticalScroll();
						
			this.fetchData();

			return this;
		},
		fetchData: function(){
			
			var self = this;
			
			var $ajax1 = utils.api.get('video/categories');
				
			var $ajax2 = utils.api.get('privacy/privacy');
			
			var $ajax3 =  utils.api.get('privacy/privacycomment');
			
			var sendData =  {iVideoId: this.model.getId()};
			
			var $ajax4 = utils.api.get('video/detail', sendData);
			
			$.when($ajax1, $ajax2, $ajax3, $ajax4)
			.done(function(data1, data2, data3, data4){
				
				var data1 = data1[0], data2 = data2[0], data3 = data3[0], data4 = data4[0];
				// error
				if (data1.error_code && data1.error_code > 0) {
					return utils.modal.alert(data1.error_message || _t('Can not load data from server'));
				}
				
				if (data2.error_code && data2.error_code > 0) {
					return utils.modal.alert(data2.error_message || _t('Can not load data from server'));
				}
				
				if (data3.error_code && data3.error_code > 0) {
					return utils.modal.alert(data3.error_message || _t('Can not load data from server'));
				}
				
				if (data4.error_code && data4.error_code > 0) {
					return utils.modal.alert(data4.error_message || _t('Can not load data from server'));
				}
				
				self.model.set(data4);
				
				// success
				self.updateContext = {
					category_options: data1,
					view_options: data2,
					comment_options: data3,
					model: self.model
				};
				self.updateView();
				
			}).fail(function(){
				
			});
		},
		updateView: function(){
			this.$updateHolder.html(this.templateUpdate(this.updateContext));
		},
		collectFormData: function(){
			return {
				iVideoId: this.model.getId(),
				iCategoryId : this.$el.find('#fcategory_id').val() || 0,
				title : this.$el.find('#ftitle').val(),
				description : this.$el.find('#fdescription').val(),
				tags : this.$el.find('#ftag').val(),
				auth_view : this.$el.find('#fauth_view').val() || '0', // authentication
				auth_comment : this.$el.find('#fauth_comment').val() || '0', 
				search : 1
			}
		},
		saveVideo : function() {
			
			if(this.$saveBtn.hasClass('processing')){
				return ;
			}
			
			var sendData = this.collectFormData();
			var settings = {context: this};
			
			if (utils.validator.isEmpty(sendData.title)) {
				utils.modal.alert(_t('Video title is required'));
				return false;
			}
			
			this.$saveBtn.addClass('processing');
			
			utils.api.post('video/edit', sendData)
			.done(this.doSaveComplete).fail(this.doSaveFail);
			
		},
		doSaveComplete: function(data){
			if (data.error_code && data.error_code > 0) {
				return utils.modal.alert(data.error_message || _t('Can not load data from server'));
			}else{
				utils.modal.toast(data.message);
				utils.history.back();
			}
			
		},
		doSaveFail: function(err, msg){
			msg  = msg || _t('Could not save data');
			this.$saveBtn.removeClass('processing');
			utils.modal.alert(msg);
		}
	});
});
