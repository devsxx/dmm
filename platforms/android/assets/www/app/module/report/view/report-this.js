define([
	'text!report/tpl/report-this.html'
],function(text){
	
	return Backbone.View.extend({
		className: 'reporter-popup',
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({message: ''}));
			
			this.$submitBtn 	= this.$el.find('#submit_report_btn');
			this.$reasonSelect  = this.$el.find('#report_reason_select');
			this.$reasonMsg     = this.$el.find('#report_reason_comment');
			
			return this;
		},
		inject: function(){
			
			utils.popup.open(this.$el);
			
			return this;
		},
		events: {
			'click #submit_report_btn': 'submitReport'
		},
		submitReport: function(){
			
            this.$reasonSelect.removeClass('error');

			if(this.$submitBtn.hasClass('processing')){
				
				return false;
			}
			
			if(utils.validator.isEmpty(this.$reasonSelect.val())){
                this.$reasonSelect.addClass('error');
				
				utils.modal.alert('Report type can not be empty');
				
				return false;
			}
			
			if(utils.validator.isEmpty(this.$reasonMsg.val())){
				
				utils.modal.alert('Message can not be empty');
				
				return false;
			}
			
			var self = this
			  , sendData = {
					iItemId: this.model.getId(),
					sItemType: this.model.getType(),
					sCategory:     this.$reasonSelect.val(),
					sDescription: this.$reasonMsg.val()
				}
			  , settings =  {context: this};
		    
		    self.$submitBtn.addClass('processing');
		      
			utils.api.post('report/add',sendData, settings)
				.done(function(data){
					if(data.error_code >0){
						utils.modal.alert(data.error_message);
					}else{
						utils.modal.toast(data.message);
						utils.popup.close();
					}
				})
				.fail(function(xhr, statusText, errThrown){
					
				})
				.always(function(){
					self.$submitBtn.removeClass('processing');
				});
		}
	});
});
