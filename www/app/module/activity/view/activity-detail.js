define([
	'activity/view/activity-item',
	'text!activity/tpl/activity-detail.html',
	'text!activity/tpl/activity-detail-update.html',
	'activity/view/activity-detail-setting'	
],function(ActivityItemView, detailText, updateText, SettingView){
	// loading feed detail
	
	return ActivityItemView.extend({
		events: {
			'click .btn-back':'goBack'
		},
		template: _.template(detailText),
		templateUpdate: _.template(updateText),
		settingView: SettingView,
		className: 'activity-detail-page',

		render: function(){
			var self = this;

			
			this.$holder =  $('#main');
			
			this.$el.html(this.template({item: this.model}));
			
			this.$scroller  =  this.$el.find('#content');
			
			this.$activityHolder = this.$el.find('#activity_extra_holder');
			
			this.$detailHolder =  this.$el.find('#activity_detail_view_holder');
			
			this.$el.prop('id', this.model.getDataId());
			
			return this;
		},
		inject: function(){
			
			this.$holder.prepend(this.$el); //Nay 
			$(".newsfeed-page").css({"opacity":0}); //Nay
			
			this.$scroller.ensureVerticalScroll(); // this one causing issue while appending the page instead of adding it

			
			utils.api.get('feed/get', {
                iActionId: this.model.getId(),
                bIsGetOneFeed: true,
                sParentId: this.model.getParentModuleId()
            },{context: this})
			.done(function(data){
				this.model.set(data[0]);
				this.doUpdateView();
			})
			.fail(function(){
				utils.debug.log(arguments);
			});
			
			utils.helper.addActivityExtraBlock(this.model, this.$activityHolder, this.$scroller);
			
			return this;
		},
		doUpdateView: function(){
			
			var haAttachment  = this.model.hasAttachment();
			
			this.$detailHolder.html(this.templateUpdate({item: this.model, hasAttachment: haAttachment}));
			
			if(haAttachment)
			{
				var View = utils.attachment.translate(this.model.getAttachmentType());
				
				this.$attachment  = this.$el.find('.item-attachment');
				
				if(View){
					
					this.attView = new View({model: this.model});
					
					this.attView.render().inject(this.$attachment);
				}
			}
		
			
			this.$activityHolder.removeClass('hide');
			
			this.$scroller.trigger('refresh');
			
			return this;
		},
		doDeleteConfirm: function(evt){
			var self = this;
			utils.popup.close();
			utils.modal.confirm('Delete this post?',function(result){
				if(result == 1){
					self.doDelete();
				}
			}, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
		},
		doDelete: function(){
			utils.api.post('feed/delete',{
                iActionId: this.model.getId(),
                sParentId: this.model.getParentModuleId()
            },{context: this})
			.done(function(data){
				if(data.error_code > 0){
					this.doDeleteFail(data.messsage);
				}else{
					this.doDeleteSuccess();
				}
			})
			.fail(function(){
				this.doDeleteFail();
			});
		},
		doDeleteFail: function(msg){
			utils.modal.alert(msg || _t('Can not delete this post!') );
		},
		doDeleteSuccess: function(){
			utils.history.back();
		},
		goBack: function(){
			utils.router.previous();
			this.$holder.find(".newsfeed-page").css({"opacity":1});
			this.$holder.find(".activity-detail-page").hide().remove();
		}
	});
});
