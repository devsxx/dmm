define([
    'text!marketplace/tpl/listing-index.html',
    'marketplace/view/listing-list',
    'marketplace/view/listing-search'
], function(text, ListingListView, SearchView) {

    return Backbone.PolyplatformView.extend({
        moduleId: 'marketplace/view/listing-index',
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function() {},
        render: function(query) {

            this.query = $.extend({}, query);

            this.$el.html(this.template(this.query));

            this.$add_btn = this.$el.find('#add_btn');
            this.$listHolder = this.$el.find('#listing_list_holder');

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.fetchData(); // fetch permissions

            this.listView = new ListingListView({}, this.$listHolder, this.$scroller);

            this.listView.render(this.query).inject();

            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

            var self = this;

            this.searchView.on('submit', function(data) {
                self.listView.resetQuery($.extend({}, self.query, data));
            });

            return this;
        },
        fetchData: function() {

            var settings = {
                context: this
            };

            utils.api.post('marketplace/perms', {}, settings).done(this.fetchDone).fail(this.fetchFail);
        },
        fetchDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            if (data.bCanCreateListing) {
                this.$add_btn.removeClass('hide');
            }
        },
        fetchFail: function(jqXHR, textStatus, errorThrown) {

            utils.debug.warn('[FAIL] marketplace/perms', arguments);
        }
    });
});