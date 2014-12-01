define([
    'text!comment/tpl/comment-item.html',
    'text!comment/tpl/comment-action.html',
    'like/view/like-list',
    'like/model/like-list'
], function(text, textAction, LikeListView, LikeListModel) {

    return Backbone.View.extend({
        events: {
            'click .delete-comment': 'onDelete',
            'click .link-like': 'onLikeClick',
            'click .link-dislike': 'onDislikeClick',
            'click .other-likes': 'handleClickOnOtherLikes'
        },

        className: 'comment-item',

        template: _.template(text),

        templateAction: _.template(textAction),

        initialize: function() {
            var self = this;
            this.model.on('change:bIsLiked change:bIsDisliked', function() {
                self.updateView();
            });
        },

        render: function() {

            this.$el.attr('data-id', this.model.getId());

            this.$el.html(this.template({
                item: this.model
            }));

            this.$el.find('.comment-action-holder').html(this.templateAction({
                item: this.model
            }));

            return this;
        },

        inject: function(inject) {
            inject(this.el);
            return this;
        },

        onDelete: function(e) {

            var self = this;
            utils.modal.confirm('Do you want to delete this comment?', function(selected) {
                if (selected == 1) { // sure == 1 to allow work on webview ( it is helpful for front-end engineer)
                    self.deleteComment();
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);

        },

        deleteComment: function() {
            var data = {
                'iCommentId': this.model.getId(),
                'iItemId': this.model.getItemId(),
                'sItemType': this.model.getItemType()
            },
                settings = {
                    'context': this,
                    'beforeSend': this.beforeSend
                };

            utils.api.post('comment/remove', data, settings)
                .done(this.postDone)
                .always(this.postComplete)
                .fail(this.postFail);

        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {},

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$el.addClass('hide');
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if (data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                this.$el.removeClass('hide');
                return false;
            } else {
                this.postSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function(data) {

            this.collection.remove(this.model);

            utils.modal.toast(_t('Delete comment successfully'));

            this.$el.remove();
        },

        postFail: function() {
            this.$el.removeClass('hide');
        },

        handleClickOnOtherLikes: function() {
            new LikeListView({
                model: new LikeListModel({
                    iItemId: this.model.getId(),
                    sItemType: this.model.getItemType()
                })
            }).render().inject();
        },

        updateView: function() {
            this.$el.find('.comment-action-holder').html(this.templateAction({
                item: this.model
            }));
        },

        onLikeClick: function(evt) {
            var $ele = $(evt.currentTarget);

            if ($ele.isProcessing()) {
                return;
            }

            $ele.isProcessing(true);

            var bIsLiked = this.model.isLiked();
            var iTotalLike = this.model.getLikeCount();
            var api = bIsLiked ? 'like/unlike' : 'like/like';
            this.model.set({
                bIsLiked: !bIsLiked,
                iTotalLike: bIsLiked ? iTotalLike - 1 : iTotalLike + 1
            });

            var sendData = {
                iCommentId: this.model.getId(),
                iItemId: this.model.getItemId(),
                sItemType: this.model.getItemType(),
                sParentId: this.model.getParentModuleId(),
            };

            var settings = {
                context: this
            };

            utils.api.post(api, sendData, settings)
                .done(function(data) {
                    if (data.error_code && data.error_code > 0) {
                        utils.modal.alert(data.error_message || data.message || _t('Can not load data from server'));
                        this.model.set({
                            bIsLiked: bIsLiked,
                            iTotalLike: iTotalLike
                        });
                        return;
                    }

                    if (data.message) {
                        utils.modal.toast(data.message);
                    }
                })
                .always(function() {
                    $ele.isProcessing(false);
                });
        },

        onDislikeClick: function(evt) {
            var $ele = $(evt.currentTarget);

            if ($ele.isProcessing()) {
                return;
            }

            $ele.isProcessing(true);

            var bIsDisliked = this.model.isDisliked();
            var iTotalDislike = this.model.getDislikeCount();
            var api = bIsDisliked ? 'like/removedislike' : 'like/dislike';
            this.model.set({
                bIsDisliked: !bIsDisliked,
                iTotalDislike: bIsDisliked ? iTotalDislike - 1 : iTotalDislike + 1
            });

            var sendData = {
                iCommentId: this.model.getId(),
                iItemId: this.model.getItemId(),
                sItemType: this.model.getItemType()
            };

            var settings = {
                context: this
            };

            utils.api.post(api, sendData, settings)
                .done(function(data) {
                    if (data.error_code && data.error_code > 0) {
                        utils.modal.alert(data.error_message || _t('Can not load data from server'));
                        this.model.set({
                            bIsDisliked: bIsDisliked,
                            iTotalDislike: iTotalDislike
                        });
                        return;
                    }

                    if (data.message) {
                        utils.modal.toast(data.message);
                    }
                })
                .always(function() {
                    $ele.isProcessing(false);
                });
        }
    });
});