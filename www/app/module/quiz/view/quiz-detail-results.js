define([
    'text!quiz/tpl/quiz-detail-results.html',
    'quiz/view/quiz-detail-results-list'
], function (text, QuizResultsListView) {

    return Backbone.PolyplatformView.extend({
        moduleId: 'quiz/view/quiz-detail',
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function () {},
        render: function (query) {

            this.query = $.extend({}, query);

            this.$el.html(this.template({
                item: this.model
            }));

            this.$listHolder = this.$el.find('#quiz_detail_results_holder');

            this.$pageTitle = this.$el.find('#page_title');

            return this;
        },
        inject: function () {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            // result list extend from a list view
            this.listView = new QuizResultsListView({},
                this.$listHolder,
                this.$scroller,
                {loadmore: false, loadnew: false});

            this.listView.render(this.query).inject();

            return this;
        }
    });
});