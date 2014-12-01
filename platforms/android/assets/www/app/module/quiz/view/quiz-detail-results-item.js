define([
    'text!quiz/tpl/quiz-detail-results-item.html'
], function(text) {

    return Backbone.View.extend({
        region : {},
        className : 'taker-item',
        template : _.template(text),
        render : function() {

            this.$el.html(this.template({
                item : this.model
            }));

            return this;
        },
        inject : function(inject) {
            inject(this.$el);
        },
        events : {
            "click #show_result_btn" : "showResult"
        },
        showResult: function () {

        }
    });
});
