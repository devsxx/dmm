define([
    'core/view/pagination',
    'forum/view/forum-poll-item',
    'forum/view/forum-post-list',
    'forum/view/forum-thread-setting',
    'poll/model/poll',
    'text!forum/tpl/forum-thread-detail.html'
], function(PaginationView, PollItemView, PostListView, SettingView, PollModel, text) {

    return Backbone.ItemView.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            poll_item_holder: '#poll_item_holder',
            post_list_holder: '#post_list_holder'
        },
        settingView: SettingView,
        template: _.template(text),
        render: function(query) {

            this.query = $.extend({
                iThreadId: this.model.getId(),
                iAmountOfPost: 10
            }, query);

            this.$el.attr('id', this.model.getDataId());

            this.$el.html(this.template({
                item: this.model
            }));

            this.$footer = this.$el.find('#footer');
            this.$footer_reply_btn = this.$el.find('#footer_reply_btn');
            this.$page_title = this.$el.find('#page_title');
            this.$pagination_holder = this.$el.find('#pagination_holder');
            this.$poll_item_holder = this.$el.find(this.region.poll_item_holder);
            this.$post_list_holder = this.$el.find(this.region.post_list_holder);
            this.$setting_btn = this.$el.find(this.model.getDataId('#setting'));

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.fetchData();

            return this;
        },
        fetchData: function() {

            var settings = {
                context: this
            };

            utils.api.post('forum/threaddetail', this.query, settings).done(this.fetchDone).fail(this.fetchFail);
        },
        fetchDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            if (data.aThread) {
                this.model.set(data.aThread);
                this.updateView();
            }

            if (!this.model.isAnnouncement() && this.model.hasPoll() && data.aPoll && data.aPoll.iPollId) {
                this.appendPoll(data.aPoll);
            }

            if (data.aPost) {
                this.appendPosts(data);
            }

            this.appendPagination();
        },
        fetchFail: function(error) {

            utils.debug.warn(error);

            utils.history.back();
        },
        updateView: function() {

            this.$page_title.html(this.model.getTitle());

            if (!this.model.isAnnouncement()) {
                this.$scroller.removeClass('with-header').addClass('with-header-footer');

                this.$setting_btn.add(this.$footer).removeClass('hide');

                if (this.model.isClosed()) {
                    this.$footer_reply_btn.html(_t('Closed'));
                }

                this.$footer_reply_btn.removeClass('hide');
            }
        },
        appendPoll: function(aPoll) {

            var self = this;
            var inject = function(dom) {
                self.$poll_item_holder.html(dom);
            };

            this.pollItemView = new PollItemView({
                model: new PollModel(aPoll)
            });

            this.pollItemView.render().inject(inject);
        },
        appendPosts: function(data) {

            this.query = $.extend(this.query, {
                thread: this.model
            });

            this.postListView = new PostListView({}, this.$el.find(this.$post_list_holder), this.$scroller, {
                loadnew: false,
                loadmore: false
            });

            this.postListView.render(this.query).inject(data);
        },
        appendPagination: function() {

            var context = {
                currentPage: this.query.iPage,
                itemLimit: this.query.iAmountOfPost,
                totalItem: this.model.getTotalPost()
            };

            var self = this;
            var inject = function(dom) {
                self.$pagination_holder.html(dom);
            };

            this.paginationView = new PaginationView();

            this.paginationView.render(context).inject(inject);

            this.paginationView.on('change', this.changePage, this);
        },
        changePage: function(page) {

            this.query.iPage = page;

            this.postListView.resetQuery(this.query);
        },
        events: {
            'subscribe': 'subscribeThread',
            'unsubscribe': 'unsubscribeThread'
        },
        doDeleteConfirm: function(evt) {

            var self = this;

            utils.modal.confirm(_t('Are you sure?'), function(selected) {
                if (selected == 1) {
                    utils.observer.trigger('blockui');

                    var postData = {
                        iThreadId: self.model.getId()
                    };

                    utils.api.post('forum/threaddelete', postData).done(function(data) {
                        if (data.error_code && data.error_code > 0) {
                            return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                        }

                        self.deleteSuccess(data);
                    }).always(function() {
                        utils.observer.trigger('releaseui');
                        utils.popup.close();
                    });
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        },
        deleteSuccess: function(data) {

            if (data.message) {
                utils.modal.toast(data.message);
            }

            utils.history.back();
        },
        subscribeThread: function(evt) {

            var $ele = $(this.model.getDataId('#subscribe'));

            if ($ele.isProcessing()) {
                return;
            }

            $ele.isProcessing(true);

            var postData = {
                iThreadId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.post('forum/threadsubscribe', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                this.subscribeSuccess(data);
            }).always(function() {
                $ele.isProcessing(false);
                utils.popup.close();
            });
        },
        subscribeSuccess: function(data) {

            this.model.set('bIsSubscribed', true);
        },
        unsubscribeThread: function(evt) {

            var $ele = $(this.model.getDataId('#unsubscribe'));

            if ($ele.isProcessing()) {
                return;
            }

            $ele.isProcessing(true);

            var postData = {
                iThreadId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.post('forum/threadunsubscribe', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                this.unsubscribeSuccess(data);
            }).always(function() {
                $ele.isProcessing(false);
                utils.popup.close();
            });
        },
        unsubscribeSuccess: function(data) {

            this.model.set('bIsSubscribed', false);
        }
    });
});