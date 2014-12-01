define([
    'text!like/tpl/like-detail.html',
    'like/view/like-list',
    'like/model/like-list',
    'core'
], function(text, LikeListView, LikeListModel, core) {

    return Backbone.View.extend({
        template: _.template(text),
        className: 'like-content',
        events: {
            'click #other-likes': 'handleClickOnOtherLikes',
        },
        initialize: function(attrs) {
            var self = this;
            this.model.on('change:bIsLiked', function() {
                self.doUpdateLike();
            });
        },
        doUpdateLike: function() {
            this.render().inject();
        },
        handleClickOnOtherLikes: function() {
            new LikeListView({
                model: new LikeListModel({
                    iItemId: this.model.getId(),
                    sItemType: this.model.getType(),
                    sParentId: this.model.getParentModuleId()
                })
            }).render().inject();
        },

        render: function() {

            var phrase0 = 'သင္',
                phrase1 = '',
                phrase2 = '',
                iTotalLike = this.model.getLikeCount(),
                iRemainLike = iTotalLike - 1,
                likes = this.model.likes;

            if (true == this.model.isLiked()) {
                phrase1 = '';
                phrase0 = 'သင္';
                if (iTotalLike > 1) {
                    phrase0 = 'သင္ႏွင့္ ';
                    phrase1 = '';
                    phrase2 = (iRemainLike > 1) ? (iRemainLike + ' ေယာက္') : (iRemainLike + ' ေယာက္');
                }

            } else {
                // console.log(iTotalLike, aLikes);
                if (iTotalLike > 0 && likes.length) {

                    var index = 0;
                    if (likes.at(0).get('iUserId') == core.viewer.getId()) {
                        index = 1;
                    }

                    phrase1 = '<a href="#user/' + likes.at(index).get('iUserId') + '" >' + likes.at(index).get('sDisplayName') + '</a>';

                    if (iTotalLike > 1) {

                        phrase2 = iTotalLike - 1;
                        if (iTotalLike - 1 > 1) {
                            phrase2 += ' ေယာက္';
                        } else {
                            phrase2 += ' ေယာက္';
                        }
                    }
                }
            }

            if (iTotalLike > 1 && !this.model.isLiked()) {
                phrase0 = 'သင္ႏွင့္ ';
            }

            this.$el.html(this.template({
                isLiked: this.model.isLiked(),
                phrase0: phrase0,
                phrase1: phrase1,
                phrase2: phrase2,
                hasAnd: phrase1 != '' && phrase2 != ''
            }));

            if (!this.model.isLiked()) {
                this.$el.find('.you-like').addClass('hide');
            }

            if (iTotalLike < 1) {
                this.$el.find('#no_likes').removeClass('hide');
            } else {
                this.$el.find('#has_like').removeClass('hide');
            }

            return this;
        }
    });
});