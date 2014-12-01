define([
    'text!page/tpl/page-top-menu.html',
    'dislike/collection/dislike',
    'dislike/view/dislike-detail'
], function(text, DislikeCollection, DislikeDetailView) {
    return Backbone.TopMenuView.extend({
        template: _.template(text),
        render: function() {
            var self = this;

            this.$el.html(this.template({
                item: this.model
            }));

            this.$dislikeHolder = this.$el.find('#dislike-list');

            this.$dislikeBtn = this.$el.find('#' + this.model.getDataId('dislike'));

            this.model.on('change:iTotalDislike change:bIsDisliked', function() {
                self.updateView();
            });

            return this;
        },
        inject: function() {
            this.model.dislikes = new DislikeCollection();

            this.model.dislikes.add(this.model.getUserDislike());

            this.$dislikeHolder.html(new DislikeDetailView({
                model: this.model
            }).render().el);

            utils.popup.open(this.$el);

            return this;
        },
        hide: function() {
            utils.popup.close();

            return this;
        },
        updateView: function() {
            var bHide = (this.model.getDislikeCount() < 1) ? true : false;
            this.$dislikeHolder.toggleClass('hide', bHide);

            var sText = this.model.isDisliked() ? _t('remove_dislike') : _t('dislike');
            this.$dislikeBtn.html(sText);
        }
    });
});