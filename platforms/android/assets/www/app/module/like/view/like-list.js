define([
    'like/model/like',
    'like/view/like-list-item',
    'text!like/tpl/like-list.html'
], function(LikeModel, LikeListItemView, text) { 


    return Backbone.View.extend({
        events: {},
        region: {
            scroller: '#like-list-content',
            holder: '#like-list-holder',
        },
		template : _.template(text),
        render: function() {
        	
            this.$el.html(this.template());
            
            this.$scroller = this.$el.find(this.region.scroller);
            
            this.$likeListHolder = this.$el.find(this.region.holder);

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
                iAmountOfLike: 9999,
                iItemId: this.model.get('iItemId'),
                sItemType: this.model.get('sItemType'),
                sParentId: this.model.get('sParentId')
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };
            
            utils.api.post('like/listalllikes', data, settings).done(this.postDone).always(this.postComplete);
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
				this.$likeListHolder.find('.loading-initiator').remove();
        	}
        	
            _.each(data, function(like) {
                this.$likeListHolder.append(new LikeListItemView({
                    model: new LikeModel({ 
                        iLikeId   : like.iLikeId,
                        iUserId   : like.iUserId,
                        sFullName : like.sFullName,
                        sImage    : like.sImage
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

