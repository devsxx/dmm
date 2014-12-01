define([
	'text!comment/tpl/post-comment.html',
], function(text) {
	return Backbone.View.extend({
		template : _.template(text),
		events : {
			'click #submit-comment-btn' : 'postComment'
		},
		postComment : function() {
			if (this.$postBtn.hasClass('processing')){
				return false;
			}

			if (this.$content.val().trim() == '') {
				utils.modal.alert('Please enter your comment');
				return false;
			}

			var data = {
				sItemType : this.model.getType(),
				sParentId : this.model.getParentModuleId(),
				iItemId : this.model.getId(),
				sText : this.$content.val()
			}, settings = {
				'context' : this,
				'beforeSend' : this.beforeSend
			};

			utils.api.post('comment/add', data, settings).done(this.postDone).always(this.postComplete);
		},

		render : function(context) {
			this.$el.html(this.template());
			this.$content = $('#comment-content', this.$el);
			this.$postBtn = $('#submit-comment-btn', this.$el);
			
			if(!this.model.canComment()){
				this.$el.addClass('hide');
			}

			return this;
		},

		/**
		 * post complete will always be called when the ajax finishes, it is the best
		 * place to collect your garbage
		 */
		postComplete : function() {
			this.$postBtn.removeClass('processing');
		},

		/**
		 * beforesend will be called right before data is send, this is the best place to
		 * initialize your awesome handling functions
		 */
		beforeSend : function() {
			this.$postBtn.addClass('processing');
		},

		/**
		 * It is called when having a response returned.
		 * Note that it will not be called if server returns status !== 200
		 */
		postDone : function(data, status, jqXHR) {
			if (data.error_code > 0) {
				utils.modal.alert(data.error_message || 'Post URL failed!');
				//defensive programming
				return false;
			} else {
				this.postSuccess(data);
			}
		},

		/**
		 * It should be called when the response has error_code == 0
		 */
		postSuccess : function(data) {

            data.parentModuleId = this.model.getParentModuleId();
			this.model.comments.add(data);

			this.model.set('iTotalComment', this.model.getCommentCount() + 1);

			this.$content.val('');
		},
	});
});

