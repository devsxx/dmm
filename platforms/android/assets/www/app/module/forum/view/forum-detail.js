define([
    'core/view/pagination',
    'forum/model/forum',
    'forum/model/thread',
    'forum/view/forum-item',
    'forum/view/forum-list',
    'forum/view/forum-quickjump',
    'forum/view/forum-search',
    'forum/view/forum-thread-item',
    'forum/view/forum-thread-list',
    'text!forum/tpl/forum-detail.html'
], function(PaginationView, ForumModel, ThreadModel, ForumItemView, ForumListView, QuickjumpView, SearchView, ThreadItemView, ThreadListView, text) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            forum_list_holder: '#forum_list_holder',
            announcement_list_holder: '#announcement_list_holder',
            thread_list_holder: '#thread_list_holder'
        },
        template: _.template(text),
        initialize: function() {},
        render: function(query) {

            this.query = $.extend({
                iForumId: this.model.getId(),
                iAmountOfThread: 10
            }, query);

            this.$el.html(this.template({
                item: this.model
            }));

            this.$add_thread_btn = this.$el.find('#add_thread_btn');
            this.$announcement_list_header = this.$el.find('#announcement_list_header');
            this.$announcement_list_holder = this.$el.find(this.region.announcement_list_holder);
            this.$forum_list_holder = this.$el.find(this.region.forum_list_holder);
            this.$forum_quickjump_holder = this.$el.find('#forum_quickjump_holder');
            this.$page_title = this.$el.find('#page_title');
            this.$pagination_holder = this.$el.find('#pagination_holder');
            this.$thread_list_header = this.$el.find('#thread_list_header');
            this.$thread_list_holder = this.$el.find(this.region.thread_list_holder);

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.fetchData();

            // search view
            this.searchView = new SearchView();

            this.searchView.render($.extend({
                sForumIds: this.model.getId()
            }, this.query)).inject();

            this.searchView.$el.find('#adv_search_toggle_btn').removeClass('no-padding');
            this.searchView.$el.find('#adv_search_holder').removeClass('no-padding'); 

            // quick jump view
            this.quickjumpView = new QuickjumpView();

            var self = this;
            this.quickjumpView.render(this.query).inject(function(dom) {
                self.$forum_quickjump_holder.html(dom);
            });

            return this;
        },
        fetchData: function() {

            var settings = {
                context: this
            };

            utils.api.post('forum/detail', this.query, settings).done(this.fetchDone).fail(this.fetchFail);
        },
        fetchDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            if (data.aForum) {
                this.model.set(data.aForum);
                this.appendInfo();
            }

            if (data.aSubForum) {
                this.appendForums(data.aSubForum);
            }

            if (data.aAnnouncement) {
                this.appendAnnouncements(data.aAnnouncement);
            }

            if (data.aThread) {
                this.appendThreads(data);
            }

            this.appendPagination();
        },
        fetchFail: function(error) {

            utils.debug.warn(error);

            utils.history.back();
        },
        appendInfo: function() {

            this.$page_title.html(this.model.getTitle());

            if (this.model.canAddThread()) {
                this.$add_thread_btn.removeClass('hide');
            }

            this.$announcement_list_header.find('.count').html('(' + this.model.getAnnouncementCount() + ')');
            this.$thread_list_header.find('.count').html('(' + this.model.getThreadCount() + ')');
        },
        appendForums: function(aSubForum) {

            if (aSubForum.length == 0) {
                return;
            }

            var items = aSubForum.map(function(item) {
                return new ForumModel(item);
            });

            var self = this;
            var inject = function(dom) {
                self.$forum_list_holder.append(dom);
            };

            _.each(items, function(item) {
                new ForumItemView({
                    model: item
                }).render().inject(inject);
            }, this);
        },
        appendAnnouncements: function(aAnnouncement) {

            if (aAnnouncement.length == 0) {
                return;
            }

            this.$announcement_list_header.removeClass('hide');

            var items = aAnnouncement.map(function(item) {
                return new ThreadModel(item);
            });

            var self = this;
            var inject = function(dom) {
                self.$announcement_list_holder.append(dom);
            };

            _.each(items, function(item) {
                new ThreadItemView({
                    model: item
                }).render().inject(inject);
            }, this);
        },
        appendThreads: function(data) {

            if (data.aThread && data.aThread.length > 0) {
                this.$thread_list_header.removeClass('hide');
            }

            this.listView = new ThreadListView({}, this.$el.find(this.$thread_list_holder), this.$scroller, {
                loadnew: false,
                loadmore: false
            });

            this.listView.render(this.query).inject(data);
        },
        appendPagination: function() {

            var context = {
                currentPage: this.query.iPage,
                itemLimit: this.query.iAmountOfThread,
                totalItem: this.model.getThreadCount()
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

            this.listView.resetQuery(this.query);
        },
        events: {
            'click .toggle-icon': 'toggleList'
        },
        toggleList: function(evt) {

            var $target = $(evt.currentTarget);

            $target.toggleClass('icon-chevron-up icon-chevron-down');

            $target.parent().next().toggleClass('hide');
        }
    });
});