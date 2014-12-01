define([
	'text!music/tpl/playlist-my-item.html'
],function(text){
	
	return Backbone.ItemView.extend({
		className: 'music-playlist-item',
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template({item: this.model }));
			
			this.$el.attr({
				'id': this.model.getDataId(),
				'rel': 'link',
				'data-url': this.model.getUrl(),
			});
			
			return this;
		},
		inject: function(inject){
			inject(this.el);
		},
		events: {
			"click .icon-pencil": "editAlbum"
		},
		editAlbum: function(event){
			var el = $(event.target).parents('.music-playlist-item');
	        var playlistid = $(event.target).data('playlistid') || 0;
	        window.location.href = "#musics/edit-playlist/"+playlistid;
		},
		doDeleteClick: function(event){
			var msg = _t('Are you sure to delete this playlist? (*Note: This action cannot rollback)');
			var self = this;
			
			utils.modal.confirm(msg, function(confirm) {
                if (confirm == 1) {
                	self.doDelete();
			    }
	        }, _t('Confirm'), [_t('Ok'),_t('Cancel')]);
		},
		doDelete: function(){
			
			this.$el.addClass('hide');
			
            utils.api.post("album/delete", {iAlbumId: this.model.getId()}, {context: this})
 		    .done(function(data){
 		    	if(data.error_code && data.error_code > 0){
 		    		this.doDeleteFail(data);
 		    	}else{
 		    		this.doDeleteSuccess();
 		    	}
	        })
	        .fail(function(data){
	        	this.$el.removeClass('hide');
	        });
		},
		doDeleteFail: function(data){
			utils.modal.alert(data.error_message);
			this.$el.removeClass('hide');
		},
		doDeleteSuccess: function(){
			this.$el.remove();
			utils.modal.toast(_t("Playlist successfully deleted."));
		}
	});
});
