define([
    'dislike/model/dislike',
    'dislike/view/dislike-list-item',
    'text!dislike/tpl/dislike-list.html'
], function(DislikeModel, DislikeListItemView, text) { 


    return Backbone.View.extend({
        events: {},
        region: {
            scroller: '#dislike-list-content',
            holder: '#dislike-list-holder',
        },
		template : _.template(text),
        render: function() {
        	
            this.$el.html(this.template());
            
            this.$scroller = this.$el.find(this.region.scroller);
            
            this.$dislikeListHolder = this.$el.find(this.region.holder);

			this.isFirst = true;
			
            return this;
        },
        
        inject: function() { 
  		
			utils.popup.open(this.$el);
			
			if(constants.os_version < '30'){
				this.$scroller.ensureSwiper();
			}
			this.fetchData();
			
			return this;
        },

        fetchData: function() {
            var data = {
                iAmountOfDislike: 9999,
                iItemId: this.model.get('iItemId'),
                sItemType: this.model.get('sItemType'),
                sParentId: this.model.get('sParentId')
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };
            
            utils.api.post('like/dislikelistalldislike', data, settings).done(this.postDone).always(this.postComplete);
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postSuccess: function (data) {
        	
        	if(this.isFirst){
        		this.isFirst = false;
				this.$dislikeListHolder.find('.loading-initiator').remove();
        	}
        	
            _.each(data, function(dislike) {
                this.$dislikeListHolder.append(new DislikeListItemView({
                    model: new DislikeModel({ 
                        iDislikeId   : dislike.iDislikeId,
                        iUserId   : dislike.iUserId,
                        sFullName : dislike.sFullName,
                        sImage    : dislike.sImage
                    })
                }).render().el);
            }, this);
			
			if(constants.os_version < '30'){
				var that = this;
                window.setTimeout(function(){
                    that.$scroller.trigger('refresh');
                },1000);
			}
        },

    });
});

