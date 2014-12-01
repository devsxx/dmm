define([

    'like/model/like-detail',
    'comment/model/comment-list',

    'comment/collection/comment',
    'like/collection/like',

    'comment/view/post-comment',
	'comment/view/comment-list',
    'like/view/like-detail',

	'text!activity/tpl/activity-extra.html',

], function(CommentListView, text){

    var LikeModel        = require('like/model/like-detail')
      , CommentListModel = require('comment/model/comment-list')
    
      , CommentCollection = require('comment/collection/comment')
	  , LikeCollection   = require('like/collection/like')
      , CommentListView  = require('comment/view/comment-list')
      , LikeDetailView   = require('like/view/like-detail')
      , PostCommentView  = require('comment/view/post-comment')

      , text             = require('text!activity/tpl/activity-extra.html')
    ;

	return Backbone.View.extend({
		className: 'activity-extra',
		region: {
			main: '#activity_extra_holder',
			content: '#content'
		},
		initialize: function(attrs, $holder, $scroller){
			this.$holder = $holder;
			this.$scroller = $scroller;
		},
		template: _.template(text),
		render: function(context){
			
			this.$el.html(this.template({item: this.model}));
			
            this.fetchExtraData();

            //init jquery variables
            this.$likeHolder = this.$el.find('#like-list');
            
            this.$commentListViewHolder = this.$el.find('#comment_list_holder');
            
            this.$postCommentHolder = this.$el.find('#comment-form');

			return this;
		},

        fetchExtraData: function() {
            var data = {
                'iItemId': this.model.getId(),
                'sParentId': this.model.getParentModuleId(),
                'sItemType': this.model.getType()
            },
                settings = {
                'context': this,
                // 'beforeSend': this.beforeSend
            };

            utils.api.post('statistic/info', data, settings).done(this.postDone).always(this.postComplete);
        },

		inject: function(){
			
			this.$holder.html(this.$el);		
			
			this.$scroller.data('loadmore_state',true); // release load more because comment is initialized.
			
			return this;
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
                utils.modal.alert(data.error_message);
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postSuccess: function (data) {

            var self = this;
            
            this.model.likes = new LikeCollection();
			
			this.model.likes.add(data.aLikes);
			            
            this.$likeHolder.html(new LikeDetailView({
                model: this.model
            }).render().el);
			
			this.model.comments = new CommentCollection(data.aComments);
            _.each(this.model.comments.models, function(comment) {
                comment.set('parentModuleId', this.model.getParentModuleId());
            }, this);
			
			//post comment view
			
			this.model.set('bCanComment', data.bCanComment);
			
            if (data.bCanComment) {
                this.postCommentView = new PostCommentView({
                    model: this.model
                });

                this.$postCommentHolder.html(this.postCommentView.render().$el);
            }

            this.commentListView = new CommentListView({
                model: this.model
            }, this.$commentListViewHolder, this.$scroller);

			this.commentListView.render().inject();
			
            //bind event
            this.postCommentView.on('comment:add', function(comment) {
                self.commentListView.prependComment(comment);
                // console.log(comment);
                // listComments.add(comment);
            });
        },
	});
});
