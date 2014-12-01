define([
    'quiz/model/taker',
    'quiz/view/quiz-detail-results-item',
    'text!quiz/tpl/quiz-detail-results-list.html'
],function(Model, ItemView, text){

    return Backbone.ListView.extend({
        defaults: {
        },
        api: 'quiz/takers',
        className: 'quiz-results-list',
        phraseNotFound: 'No one has done this quiz yet.',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});
