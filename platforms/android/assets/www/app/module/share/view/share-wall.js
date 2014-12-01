define([
	'text!share/tpl/share-wall.html'
],function(text){
	
	return Backbone.View.extend({
		events: {
			'click #submit': 'submit'
		},
		className: 'sharer-modal',
		template: _.template(text),
		hide: function(){
			utils.popup.close();
		},
		submit: function(){
			
			var dom = this.$el;
			
			var btn = dom.find('#submit');
			
			if(btn.data('disabled')){
				return false;
			}
			
			var text = dom.find('#share_message').val()
			  , id = dom.find('#share_id').val()
			  , type = dom.find('#share_type').val();
              
            if (!text) {
                return utils.modal.alert(_t('Add some text to share.'));
            }
			
			btn.data('disabled',true);
			
			btn.text('မွ်ေ၀မယ္...');
			
			var post = {
				iItemId: this.model.getId(),
				sItemType: this.model.getType(),
				sContent: text
			}
			
			var self = this;
			
			utils.api.post('feed/share', post, {context: this})
			.done(function(data){
				utils.modal.toast('Shared successful!');	
				utils.popup.close();
			})
			.fail(function(data){
				utils.modal.alert(data.error_message);
			})
			.always(function(){
				btn .data('disabled',false)
					.text('Share');
			});
			
		},
		render: function(context){
			
			this.context = $.extend({
				fixtop: false
			}, context);
			
			this.$el.html(this.template(this.context));
			
			return this;
		}, 
		inject: function(){
			
			var callback = function(){
//				$('#share_message').focus();
			};
			
			if(this.context.fixtop){
				callback  = function(){
					$('#simple-popup').css({top: 180});
//					$('#share_message').focus();
				}
			}
			
			utils.popup.open(this.$el, callback);
			
			return this;
		}
	});
});
