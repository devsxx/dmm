define([
    'utils/extend/view-polyplatform',
    'report/view/report-this',
    'share/view/share-this',
    'share/view/share-wall',
    'rate/view/rate-this',
    'comment/view/comment-page',
], function() {
    
    var shareWallView  =  require('share/view/share-wall');

    Backbone.ItemView = Backbone.PolyplatformView.extend({
        className: 'list-item',
        initialize: function(atts, option) {
            this.events = _.extend(this.events || {}, {
                'detail': 'onViewDetailClick',
                'comment': 'onCommentClick',
                'rate': 'onRateClick',
                'like': 'onLikeClick',
                'dislike': 'onDislikeClick',
                'report': 'onReportClick',
                'setting': 'onSettingClick',
                'share': 'onShareClick',
                'delete': 'onDeleteClick'
            });

            var self = this;

            this.model.on('change:iTotalComment', function() {
                self.doUpdateCommentCount();
            }).on('change:bIsLiked', function() {
                self.doUpdateLike();
            }).on('change:bIsDisliked', function() {
                self.doUpdateDislike();
            }).on('change:iRatingCount', function() {
                self.doUpdateRateValue();
            });

        },
        detailView: null,
        settingView: null,
        reportView: require('report/view/report-this'),
        shareView: require('share/view/share-this'),
        rateView: require('rate/view/rate-this'),
        commentView: require('comment/view/comment-page'),
        topMenuView: null,
        render: function(context) {

            this.$el.html(this.template(context));

            return this;
        },
        inject: function(callback) {
            callback(this.$el);
            return this;
        },
        getReportView: function(model) {
            return new this.reportView({
                model: this.model
            });
        },
        getShareView: function(model) {
            return new this.shareView({
                model: this.model
            });
        },
        getRateView: function(model) {
            return new this.rateView({
                model: this.model
            });
        },
        getSettingView: function(model) {
            return new this.settingView({
                model: this.model
            });
        },
        getCommentView: function(model) {
            return new this.commentView({
                model: this.model
            });
        },
        getDetailView: function(model) {
            return new this.detailView({
                model: this.model
            });
        },
        onLikeClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('like')) {
                return false;
            }

            evt.preventDefault();

            this.doPostLike();

        },
        onDislikeClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('dislike')) {
                return false;
            }

            evt.preventDefault();

            this.doPostDislike();

        },
        onReportClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('report')) {
                return false;
            }

            evt.preventDefault();

            new this.reportView({
                model: this.model
            }).render().inject();
        },
        onCommentClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('comment')) {
                return false;
            }

            evt.preventDefault();

            var display = data.display || false,
                commentUrl = this.model.getCommentUrl();

            if (display == 'page') {
                return this.getCommentView({
                    model: this.model
                }).render().inject();
            } else if (display == 'focus') {
                this.$el.find('#comment-content').focus();
            } else {
                window.location.href = commentUrl;
            }
        },
        onViewDetailClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('detail')) {
                return false;
            }

            evt.preventDefault();

            var display = data.display || false,
                detailUrl = this.model.getDetailUrl();

            if (display == 'page') {
                return this.getDetailView({
                    model: this.model
                }).render().inject();
            } else if (display == 'page') {
                window.location.href = detailUrl;
            }
        },

        onShareClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('share')) {
                return false;
            }

            evt.preventDefault();

            this.getShareView().render().inject();
        },
        doShareToWall: function(evt, data){
            evt.preventDefault();
            
            if (!data.id || data.id != this.model.getDataId('sharewall')) {
                return false;
            }
            
            (new shareWallView({model: this.model})).render().inject();
        },
        doShareSocial: function(evt, data){
            if (!data.id || data.id != this.model.getDataId('sharesocial')) {
                return false;
            }
            
            evt.preventDefault();
             
            window.plugins.socialsharing.share(null,null,[],encodeURI(this.model.getSocialShareUrl()),function(){
                utils.modal.toast('Shared successful!');
            }, function(){
                console.log(JSON.stringify(arguments));
            });
            
            utils.popup.close();
        },
        onRateClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('rate')) {
                return false;
            }

            evt.preventDefault();

            if (this.model.isRated()) {
                utils.modal.alert(_t('You have rated!'));
                return false;
            }

            this.getRateView().render().inject();
        },
        onSettingClick: function(evt, data) {

            if (!data.id || data.id != this.model.getDataId('setting')) {
                return false;
            }

            evt.preventDefault();

            this.getSettingView().render().inject();
        },
        onDeleteClick: function(evt, data) {
            if (!data.id || data.id != this.model.getDataId('delete')) {
                return false;
            }

            evt.preventDefault();

            this.doDeleteConfirm(evt, data);
            // this function should be override on parent template.	
        },
        doDeleteConfirm: function() {
            // pass delete confirm to make sure how to done this object.
        },
        doPostLike: function() {
            var $ele = $(this.model.getDataId('#like'));

            if ($ele.isProcessing()) {
                return;
            }

            if (!this.model.canLike()) {
                return utils.modal.toast(_t('You don\'t have permission to like this item'));
            }

            $ele.isProcessing(true);

            var bIsLiked = this.model.isLiked();
            var iTotalLike = this.model.getLikeCount();
            var api = bIsLiked ? 'like/unlike' : 'like/like';
            var sendData = {
                iItemId: this.model.getId(),
                sItemType: this.model.getType(),
                sParentId: this.model.getParentModuleId()
            };
            var settings = {
                context: this
            };

            utils.api.post(api, sendData, settings)
                .done(this.doLikeComplete)
                .fail(this.doLikeFail)
                .always(function() {
                    $ele.isProcessing(false);
                });
        },
        doLikeComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.toast(data.error_message || _t('Can not load data from server'));
            }

            this.updateLikeData(data);
        },
        doLikeFail: function() {

            utils.debug.warn('FAIL: doPostLike', arguments);
        },
        doPostDislike: function() {
            var $ele = $(this.model.getDataId('#dislike'));

            if ($ele.isProcessing()) {
                return;
            }

            if (!this.model.canDislike()) {
                return utils.modal.toast(_t('You don\'t have permission to dislike this item'));
            }

            $ele.isProcessing(true);

            var bIsDisliked = this.model.isDisliked();
            var iTotalDislike = this.model.getDislikeCount();
            var api = bIsDisliked ? 'like/removedislike' : 'like/dislike';
            var sendData = {
                iItemId: this.model.getId(),
                sItemType: this.model.getType()
            };
            var settings = {
                context: this
            };

            utils.api.post(api, sendData, settings)
                .done(this.doDislikeComplete)
                .fail(this.doDislikeFail)
                .always(function() {
                    $ele.isProcessing(false)
                });
        },
        doDislikeComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.toast(data.error_message || _t('Can not load data from server'));
            }

            this.updateLikeData(data);
        },
        doDislikeFail: function() {

            utils.debug.warn('FAIL: doPostDislike', arguments);
        },
        updateLikeData: function(data) {

            this.model.set({
                aDislikes: data.aDislikes || [],
                aLikes: data.aLikes || [],
                bIsDisliked: data.bIsDisliked || false,
                bIsLiked: data.bIsLiked || false,
                iTotalDislike: data.iTotalDislike || 0,
                iTotalLike: data.iTotalLike || 0
            });

            this.doUpdateLike();
            this.doUpdateDislike();
        },
        doUpdateLike: function() {
            // do update like here.
            var elementId = this.model.getDataId('#like'),
                $ele = this.$el.find(elementId),
                $span = $ele.find('span'),
                prefix = $span.data('suffix') || false,
                bIsLiked = this.model.isLiked();

            $ele.toggleClass('liked', Boolean(bIsLiked));
            $span.text(prefix ? this.model.getLikeCountLabel() : this.model.getLikeCount());
        },
        doUpdateDislike: function() {
            // do update dislike here.
            var elementId = this.model.getDataId('#dislike'),
                $ele = this.$el.find(elementId),
                $span = $ele.find('span'),
                prefix = $span.data('suffix') || false,
                bIsDisliked = this.model.isDisliked();

            $ele.toggleClass('disliked', Boolean(bIsDisliked));
            $span.text(prefix ? this.model.getDislikeCountLabel() : this.model.getDislikeCount());
        },
        doUpdateCommentCount: function() {
            var elementId = this.model.getDataId('#comment'),
                $ele = this.$el.find(elementId),
                $span = $ele.find('span'),
                prefix = $span.data('suffix') || false;

            if (prefix) {
                $span.text(this.model.getCommentCountLabel());
            } else {
                $span.text(this.model.getCommentCount());
            }
        },
        doUpdateRateValue: function() {

            var elementId = this.model.getDataId('#rate'),
                $ele = this.$el.find(elementId),
                $span = $ele.find('span'),
                prefix = $span.data('suffix') || false;

            if (this.model.isRated()) {
                $ele.addClass('rated');
            } else {
                $ele.removeClass('rated');
            }

            if (prefix) {
                $span.text(this.model.getRateValueLabel());
            } else {
                $span.text(this.model.getRateValue());
            }
        }
    });

    Backbone.InlineView = Backbone.View.extend({
        template: null,
        initialize: function(attrs, $wrapper) {
            this.$wrapper = $wrapper;
        },
        render: function() {
            this.$el.html(this.template({
                item: this.model
            }));
            return this;
        },
        inject: function() {
            this.$wrapper.html(this.$el);
            this.$wrapper.removeClass('hide');
            return this;
        }
    });

    Backbone.DetailView = Backbone.ItemView.extend({
        className: 'detail-page',
    });
});