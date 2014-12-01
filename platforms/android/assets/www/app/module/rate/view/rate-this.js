define([
	'text!rate/tpl/rate-this.html'
],function(text){
	
	return Backbone.View.extend({
		events: {
			'click .rate-item': 'submit'
		},
		className: 'rater-modal',
		template: _.template(text),
		submit: function(evt){
			
			if(!evt){return false;}
	
			if(false == this.model.canRate())
			{
				utils.modal.alert('You have no permission to rate this item!');
				return false;
			}
			
			if(this.model.isRated()){
				utils.modal.alert('You have rated this item!');
				return false;
			}
			
			var ele = $(evt.currentTarget)
			  , parent   = ele.closest('.rate-bar')
			  , dataRate = this.context.dataRate
			  , $relate  = this.context.$relate;
			
			if(parent.data('disabled')){
				return false;
			}
			
			parent.data('disabled',true);
			
			var als = parent.find('.rate-item');
			
			
			var point = parseInt(ele.data('point'), 10);
			
			for(var i = 0; i< point && i < als.length; ++i){
				$(als.get(i)).addClass('rated');
			}
			
			// type;id;count;value;canRate;isRated
			
			var count		= parseInt(this.model.getRateCount(), 10)
			  , fValue 		= this.model.getRateFloatValue()
			  , newfValue 	= (count * fValue + point) / (count + 1);
          console.log(count, fValue, newfValue, point);
			  
			this.model.set({
				fRating: newfValue,
				bIsRating: true,
				fRatingPrevious: fValue,
				iRatingCount: count +1
			});
			
			
			var sendData = {
				sItemType: this.model.getType(),
				iItemId: this.model.getId(),
				iRating: point
			}
			
			// recalulate rateValue
			
			utils.api.post('core/rate',sendData, {context: this})
			.done(function(data){
				if(data.error_code && parseInt(data.error_code, 10) > 0){
                    var message = '';
                    if(_.isArray(data.error_message)) {
                        message = data.error_message[0];
                    } else {
                        message = data.error_message;
                    }
					utils.modal.alert(message);
					this.postRateFail();
				}else{
					utils.modal.toast(data.message || 'You have rated successful!');
				}
			})
			.fail(function(data){
				this.postRateFail();
				utils.modal.alert(data.error_message);
			})
			.always(function(){
				utils.popup.close();
			});
		},
		postRateFail: function(){
			var count		= this.model.getRateCount()
			  , point       = this.model.get('iRating')
			  , fValue 		= this.model.getRateFloatValue()
			  , newfValue 	= (count * fValue - point) / (count - 1);
			  
		  this.model.set({
			fRating: this.model.get('fRatingPrevious'),
			bIsRating: false,
			iRatingCount: count -1
		  });
		},
		render: function(context){
			this.context = $.extend({
				$relate: null,
				fixtop: false
			},context);
			
			this.$el.html(this.template(this.context));
			
			return this;
		},
		inject: function(){
		
			var callback = function(){};
			
			if(this.context.fixtop){
				callback  = function(){
					$('#simple-popup').css({top: 250});
				}
			}
			
			utils.popup.open(this.$el, callback);
			
			return this;
		}
	});
});
