define([
    'text!quiz/tpl/quiz-index.html',
    'quiz/view/quiz-list',
    'quiz/view/quiz-search'
], function (text, QuizListView, SearchView) {

    return Backbone.PolyplatformView.extend({
        moduleId: 'quiz/view/quiz-index',
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function () {},
        render: function (query) {

            this.query = $.extend({}, query);

            this.$el.html(this.template(this.query));

            this.$listHolder = this.$el.find('#quiz_list_holder');

            return this;
        },
        inject: function () {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.listView = new QuizListView({}, this.$listHolder, this.$scroller);

            this.listView.render(this.query).inject();

            this.searchView = new SearchView();

            this.searchView.render(this.query).inject();

            var self = this;

            this.searchView.on('submit', function (data) {
                self.listView.resetQuery($.extend({}, self.query, data));
            });

            this.fetchData();

            return this;
        },
        fetchData: function () {

            var settings = {
                context: this
            };

            utils.api.post('quiz/perms', {}, settings).done(function(data){

                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                }

                if (data.bCanCreateQuiz) {
                    $('#add-btn').removeClass('hide');
                }
            });
        }
    });
});