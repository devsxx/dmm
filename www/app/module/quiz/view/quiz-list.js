define([
    'quiz/model/quiz',
    'quiz/view/quiz-item',
    'quiz/view/quiz-my-item',
    'text!quiz/tpl/quiz-list.html',
], function (Model, ItemView, MyItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iAmountOfQuiz: 10,
            sSearch: ""
        },
        followById: false,
        api: 'quiz/fetch',
        phraseNotFound: _t('No quizzes found.'),
        phraseNotMore: _t('No more quizzes.'),
        className: 'quiz-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView,
        render: function(query){
			
			this.query = $.extend({}, this.defaults, query);
			
            if (this.query.sView == 'my') {
                this.itemView = MyItemView;
                this.$el.removeClass('quiz-list').addClass('my-quiz-list');
            }
			
			this.$el.html(this.template());
            
			this.isFirst = true;
			
			return this;
		}
    });
});