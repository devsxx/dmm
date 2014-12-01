define([
    'text!quiz/tpl/quiz-search.html'
], function (text) {

    return Backbone.View.extend({
        region: {
            holder: '#search_view_holder'
        },
        className: 'search-area',
        template: _.template(text),
        render: function (query) {

            this.$el.html(this.template($.extend({}, query)));

            this.$orderInput = this.$el.find('#search_order');
            this.$keywordInput = this.$el.find('#search_keywords');
            this.$advSearchHolder = this.$el.find('#adv_search_holder');

            return this;
        },
        inject: function () {

            $(this.region.holder).html(this.$el);

            return this;
        },
        events: {
            "click #adv_search_toggle_btn": "toggleAdvSearch",
            "click #search_icon": "submitSearch",
            "click #search_btn": "submitSearch"
        },
        toggleAdvSearch: function (evt) {
            this.$advSearchHolder.toggleClass("hide");
        },
        submitSearch: function () {

            this.$advSearchHolder.addClass('hide');

            this.trigger('submit', {
                sSearch: this.$keywordInput.val() || '',
                sOrder: this.$orderInput.val() || 'recent'
            });
        }
    });
});