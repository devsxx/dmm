define([
	'text!activity/tpl/activity-item.html',
	'activity/view/activity-setting'
],function(text, SettingView){
	
	return Backbone.ItemView.extend({
		className: 'clearfix activity-item',
		template: _.template(text),
		attView: false,
		settingView: SettingView,
		events: {},
		render: function()
		{
			this.$el.html(this.template({item: this.model, hasAttachment: this.model.hasAttachment() }));
			
			this.$el.attr('id', this.model.getDataId());
			
			return this;
		}, 
		inject: function(inject){
			
			inject(this.$el);
			
			var haAttachment  = this.model.hasAttachment();
			
			if(haAttachment)
			{
				var View = utils.attachment.translate(this.model.getAttachmentType());
				
				if(View){

					this.attView = new View({model: this.model});
					this.attView.render().inject(this.$el.find('.item-attachment'));	
				}
			}
			
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
			this.$el.addClass('hide');
			utils.api.post('feed/delete',{
                iActionId: this.model.getId(),
                sParentId: this.model.getParentModuleId()
            },{context: this})
			.done(function(data){
				if(data.error_code > 0){
					this.doDeleteFail();
				}else{
					this.doDeleteSuccess();
				}
			})
			.fail(function(){
				this.doDeleteFail();
			});
		},
		doDeleteFail: function(){
			this.$el.removeClass('hide');
		},
		doDeleteSuccess: function(){
			this.$el.remove();
		}
	});
});
