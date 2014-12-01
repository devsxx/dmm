define([
    'text!core/tpl/pagination.html'
], function(text) {

    return Backbone.View.extend({
        className: 'pagination',
        template: _.template(text),
        events: {
            'click #first_page_btn': 'onFirstPageClick',
            'click #last_page_btn': 'onLastPageClick',
            'click #next_page_btn': 'onNextPageClick',
            'click #prev_page_btn': 'onPrevPageClick'
        },
        render: function(context) {

            this.context = $.extend({
                currentPage: 1,
                itemLimit: 10,
                totalItem: 0
            }, context);

            this.context.totalPage = Math.ceil(this.context.totalItem / this.context.itemLimit) || 1;

            this.$el.html(this.template({
                context: this.context
            }));

            return this;
        },
        inject: function(callback) {

            callback(this.$el);

            return this;
        },
        onFirstPageClick: function(evt) {

            if (this.context.currentPage == 1) {
                return;
            }

            this.context.currentPage = 1;

            this.updateView();
        },
        onLastPageClick: function(evt) {

            if (this.context.currentPage == this.context.totalPage) {
                return;
            }

            this.context.currentPage = this.context.totalPage;

            this.updateView();
        },
        onNextPageClick: function(evt) {

            if (this.context.currentPage == this.context.totalPage) {
                return;
            }

            this.context.currentPage++;

            this.updateView();
        },
        onPrevPageClick: function(evt) {

            if (this.context.currentPage == 1) {
                return;
            }

            this.context.currentPage--;

            this.updateView();
        },
        updateView: function() {

            this.$el.html(this.template({
                context: this.context
            }));

            this.trigger('change', this.context.currentPage);
        }
    });
});