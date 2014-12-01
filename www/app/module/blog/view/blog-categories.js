define([
    'text!blog/tpl/blog-categories.html'
], function(text) {
    return Backbone.View.extend({
        region: {
            content: '#popup-content'
        },
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                delegateId: 'blog_add',
                filter: 'public',
                list: []
            }, context);

            this.$el.html(this.template({
                context: this.context
            }));

            return this;
        },
        inject: function() {

            var content = $(this.region.content);

            content.vscroll();

            utils.popup.open(this.$el);

            return this;
        },
        events: {
            'change .category-item-checkbox': 'updateCategories'
        },
        updateCategories: function(evt) {

            var aSelected = [];

            var $checkboxs = this.$el.find('.category-item-checkbox');

            _.each($checkboxs, function(checkbox) {
                if ($(checkbox).is(':checked')) {
                    aSelected.push($(checkbox).val());
                }
            }, this);

            var $delegate_el = $(document).find('#' + this.context.delegateId);

            $delegate_el.trigger('updatecategories', {
                selected: aSelected
            });
        }
    });
});