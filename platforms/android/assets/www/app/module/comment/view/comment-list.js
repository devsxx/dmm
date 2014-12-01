define([
    'text!comment/tpl/comment-list.html',
    'comment/collection/comment',
    'comment/view/comment-item',
], function(text, Collection, ItemView) {

    return Backbone.View.extend({
        region: {
            more: '.view-more-comment',
        },

        events: {
            'click .view-more-comment': 'viewMoreComment'
        },

        className: 'comment-list',

        template: _.template(text),

        isFirst: true,

        initialize: function(attrs, $holder, $scroller) {

            this.processing = false;

            this.$holder = $holder;

            this.$scroller = $scroller;

            var self = this;

            this.model.comments.on('add', function(model) {
                self.appendComment(model);
            }, this).on('remove', function() {
                self.model.set('iTotalComment', self.model.getCommentCount() - 1);
            });

        },

        loadMoreComment: function() {
            if (this.processing) return;

            var $last_comment_item = this.$el.find('.comment-item').last();

            var data = {
                iItemId: this.model.getId(),
                sParentId: this.model.getParentModuleId(),
                sItemType: this.model.getType(),
                iLastCommentIdViewed: $last_comment_item.data('id')
            };
            var settings = {
                'context': this,
                'beforeSend': this.beforeSend
            };

            utils.api.post('comment/listallcomments', data, settings).done(this.postDone).always(this.postComplete);

        },

        render: function() {
            var self = this;

            this.$el.html('');

            //init jquery variable
            this.$loadMore = $(this.region.more, this.$el);

            this.$noMoreComment = $('.no-more-comment', this.$el); // the scroll lies outside this view

            this.$scroller.trigger('loadmore:end');

            this.model.comments.each(function(comment) {
                this.appendComment(comment);
            }, this);

            setTimeout(function() {
                self.$scroller.trigger('loadmore:unlock').trigger('refresh');
            }, 1000);

            this.checkLoadMore();

            this.$scroller.on('loadmore:load', function() {
                self.loadMoreComment();
            });

            return this;
        },

        inject: function() {
            this.$holder.html(this.$el);
            return this;
        },

        checkLoadMore: function() {
            if (this.model.getCommentCount() > this.model.comments.length) { // it is NOT trivial to remain this consistence
                // this.$loadMore.removeClass('hide');
            } else {
                this.$scroller.data('loadmore_state', false);
                this.$noMoreComment.removeClass('hide');
            }
        },

        appendComment: function(comment) {
            this.$el.append(new ItemView({
                collection: this.model.comments,
                model: comment
            }).render().el);
            this.$scroller.trigger('refresh');
        },

        prependComment: function(comment) {
            this.$el.prepend(new ItemView({
                collection: this.model,
                model: comment
            }).render().el);
            this.$scroller.trigger('refresh');
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.processing = false;
            this.$scroller.trigger('loadmore:end');

        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.processing = true;
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if (data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function(data) {
            this.model.comments.add(data);
            this.checkLoadMore();
        },

    });
});