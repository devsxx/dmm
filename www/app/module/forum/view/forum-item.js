define([
    'text!forum/tpl/forum-category-item.html',
    'text!forum/tpl/forum-item.html'
], function(textCategory, text) {

    var ForumItemView = Backbone.View.extend({
        className: 'forum-item',
        template: _.template(text),
        render: function(query) {

            this.query = $.extend({}, query);

            this.$el.attr('id', this.model.getDataId());

            if (this.model.isCategory()) {
                this.template = _.template(textCategory);
            }

            this.$el.html(this.template({
                item: this.model
            }));

            this.$child_list = this.$el.find('.child-list');

            return this;
        },
        inject: function(inject) {

            inject(this.el);

            if (this.model.isCategory()) {
                this.appendChilds();
            }
        },
        appendChilds: function() {

            this.childs = this.model.getChilds();

            _.each(this.childs, function(child) {
                this.appendChild(child);
            }, this);
        },
        appendChild: function(child) {

            var self = this;
            var inject = function(dom) {
                self.$child_list.append(dom);
            };

            new ForumItemView({
                model: child
            }).render(this.query).inject(inject);
        },
        events: {
            'click .toggle-list-icon': 'toggleChildList'
        },
        toggleChildList: function(evt) {

            var $target = $(evt.currentTarget);

            if ($target.data('id') != this.model.getDataId()) {
                return;
            }

            $target.toggleClass('icon-chevron-up icon-chevron-down');

            this.$child_list.toggleClass('hide');
        }
    });

    return ForumItemView;
});