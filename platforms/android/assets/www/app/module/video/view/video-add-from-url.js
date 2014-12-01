define([
	'text!video/tpl/video-add-from-url.html'
],function(){
	var PopupView = Backbone.View.extend({
		initialize: function(options, deferred, settings){
			this.deferred = deferred;
			this.settings = $.extend({	
					needParse: false
			}, settings);
		},
		id: 'ynupdate_status_video_popup',
		template: _.template(require('text!video/tpl/video-add-from-url.html')),
		render: function(context)
		{
			this.context = $.extend({}, context);
			
			this.$el.html(this.template(this.context));
			
			return this;
		},
		inject: function(){
			
			utils.popup.open(this.$el);
			
			return this;
		},
		events: {
			'click .video-type': 'selectUrlType',
			'click #submit_video_from_url_btn': 'submitUrl'
		},
		submitUrl: function(evt){
			var elVideoUrl 		= this.$('#video_url')
			  , sVideoUrl		= elVideoUrl.val()
			  , needParse		= this.settings.needParse
			  , iVideoType		= this.iVideoType
			  , elSubmitBtn  	= this.$('#submit_video_from_url_btn');
			 
			if(elSubmitBtn.isProcessing()){
				return false;
			}
			  
			if(utils.validator.isEmpty(sVideoUrl)){
				utils.modal.alert(_t('Please insert URL'));
				return false;
			}
			 
			if(!utils.validator.isUrl(sVideoUrl))
			{
				utils.modal.alert(_t('Link is not valid'));
				return false;
			}
			
			if(!iVideoType){
				utils.modal.alert(_t('Please choose video type'));
				return false;
			}
			
			if(iVideoType == 1 && !utils.validator.isYoutubeVideoUrl(sVideoUrl)){
				utils.modal.alert(_t('Link is not valid YouTube video'));
				return false;
			}
			
			
			if(iVideoType == 2 && !utils.validator.isVimeoVideoUrl(sVideoUrl)){
				utils.modal.alert(_t('Link is not valid Vimeo video'));
				return false;
			}
			
			if(!needParse){
				// resolve this url if correcting, please ensure what is needed.
				this.deferred.resolve({
					error_code: 0,
					error_message: '',
					sVideoUrl: sVideoUrl, 
					iVideoType: iVideoType
				});
				
				utils.popup.close();
				
				return true;
			}
			
	      	utils.api.post('video/parser', {
                sLink: sVideoUrl,
                iType: iVideoType
            }, {
            	context: this,
            	beforeSend: function(){
            		elSubmitBtn.isProcessing(true);
            		utils.observer.trigger('blockui');
            	}
            })
			.done(function(data){
				console.log(data);
			})
            .fail(function(data){
            	utils.modal.alert(data.error_message);
            })
            .always(function(){
            	elSubmitBtn.isProcessing(false);
            	utils.observer.trigger('releaseui');
            });
		},
		selectUrlType : function(evt) {
			
			var $ele =  $(evt.currentTarget);
			
			$ele.closest('ul').find('li').removeClass('active');
			
			$ele.addClass('active');
			
			this.iVideoType = $ele.data('type');
		},
	});
	
	/**
	 * test:
	 * - http://www.youtube.com/watch?v=tQXVpOhxYPA
	 * @param {Object} settings
	 */
	return function(renderOptions, settings){
		
		var deferred =  $.Deferred();
		
		var view  = new PopupView({}, deferred, settings)
			.render(renderOptions)
			.inject();
		
		return view.deferred;
	}
});
