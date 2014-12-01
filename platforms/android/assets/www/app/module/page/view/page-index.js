define([
    'text!page/tpl/page-index.html',
    'page/view/page-search',
    'page/view/page-list'
], function(text, SearchView, ListView){

    return Backbone.PolyplatformView.extend({
        moduleId: 'page/view/page-index',
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function() {},
        render: function(query) {    //pass data to view

            this.query = $.extend({}, query);

            this.$el.html(this.template(this.query));

            this.$listHolder = this.$el.find('#page_list_holder');

            return this;    // chain function call
        },
        inject: function(){

            var self = this;

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            // create and inject search view

            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

            this.searchView.on('submit', function (data) {
                self.listView.phraseNotFound = _t('No pages found.');
                self.listView.resetQuery($.extend({}, self.query, data));
            });

            // create and inject list view

            this.listView = new ListView({}, this.$listHolder, this.$scroller);

            this.listView.render(this.query).inject();


            return this;
        }
    });
});
