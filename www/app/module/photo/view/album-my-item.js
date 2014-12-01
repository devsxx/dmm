define([
	'text!photo/tpl/album-my-item.html',
    'photo/view/album-item-setting'
],function(text, SettingView){
	
	return Backbone.ItemView.extend({
		className: 'photo-my-album-item',
		template: _.template(text),
		render: function(){
			this.$el.attr("id", this.model.getDataId());
			this.$el.attr("data-albumid",this.model.getId());
			this.$el.html(this.template({item: this.model}));
			return this;
		},
		inject: function(inject){
			inject(this.$el);
			
			var width = this.$el.find('.item-wrapper').first().width();
			
			this.$el.find('.item-image').css({width: width});
			
			var container = this.$el.find('.swiper-container');
			
			container.swiper({
				scrollContainer: true,
				mode: 'horizontal',
				slidesPerView: 'auto'
			});
		},
		events: {
            'edit': 'editAlbum'
		},
        settingView: SettingView,
		editAlbum: function(event){
	        window.location.href = "#photos/edit-album/"+this.model.getId();
		},
		doDeleteConfirm: function (evt) {
			var self = this;
        	var $target = $(evt.currentTarget);
        	
        	if ($target.hasClass('processing')) {
        		return;
        	}
        	
        	utils.modal.confirm(_t('Do you want to delete this album?'), function(result) {
                if(result === 1) {
                    $target.addClass('processing');
                    
                    utils.api.post('photo/albumdelete', {iAlbumId: self.model.getId()})
                    .done(function (data) {
                    	if (data.error_code && data.error_code > 0) {
			        		return utils.modal.alert(data.error_message || _t('Can not load data from server'));
			        	}
			        	
			        	self.deleteSuccess(data);
                    })
                    .always(function () {
                    	$target.removeClass('processing');
                    });
                }
            }, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
		},
		deleteSuccess: function (data) {
        	utils.modal.toast(_t("The album has been deleted successfully."));
        	this.$el.remove();
        	utils.popup.close();
        }
	});
});
