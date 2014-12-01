define([
    'page/view/page-more-menu'
], function(MoreMenuView) {
    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content',
            list_holder: '#list_holder',
            page_title: '#page_title'
        },
        activeModule: '',
        listView: null,
        searchView: null,
        template: null,
        initialize: function() {},
        render: function(query) {

            this.query = $.extend({
                iItemId: this.model.getId(),
                sModule: 'pages'
            }, query);

            this.$el.html(this.template({
                item: this.model
            }));

            this.$list_holder = this.$el.find(this.region.list_holder);

            this.$page_title = this.$el.find(this.region.page_title);

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.fetchData();

            this.appendListView();

            this.appendSearchView();

            return this;
        },
        fetchData: function() {

            var postData = {
                iPageId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('pages/info', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.model.alert(data.error_message || _t('Can not load data from server'));
                }

                this.model.set(data);
                this.updateView();
            }).fail(function(error) {
                utils.debug.error(error);
            });
        },
        updateView: function() {

            this.$page_title.html(this.model.getTitle());
        },
        appendListView: function() {

            this.listView = new this.listView({}, this.$list_holder, this.$scroller);

            this.listView.render(this.query).inject();
        },
        appendSearchView: function() {

            this.searchView = new this.searchView();

            this.searchView.render(this.query).inject();

            var self = this;

            this.searchView.on('submit', function(data) {
                self.listView.resetQuery($.extend({}, self.query, data));
            });
        },
        events: {
            'click #footer_more_btn': 'showMoreMenu'
        },
        showMoreMenu: function(evt) {

            this.moreMenu = new MoreMenuView({
                model: this.model
            }).render({
                activeModule: this.activeModule
            }).inject();
        }
    });
});