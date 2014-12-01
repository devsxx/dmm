define([
    'video/view/video-item',
    'text!video/tpl/video-detail-info.html',
    'text!video/tpl/video-detail-info-update.html',
    'video/view/video-topmenu',
], function(VideoItemView, text, textUpdate, TopMenuView) {


    return VideoItemView.extend({
        events: {
            'click #top_menu_toggle': 'toggleTopMenu',
        },
        region: {
            holder: '#main',
            scroller: '#content',
            detailHolder: '#video_detail_info_holder',
            activityExtraHolder: '#activity_extra_holder',
            topMenu: '#top_menu_toggle'
        },
        className: 'video-detail-page',
        template: _.template(text),
        topMenuView: TopMenuView,
        templateDetail: _.template(textUpdate),
        render: function() {

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $('#main');

            this.$activityExtraHolder = this.$el.find(this.region.activityExtraHolder);

            this.$detailHolder = this.$el.find(this.region.detailHolder);

            this.$scroller = this.$el.find(this.region.scroller);

            this.$topMenuBtn = this.$el.find(this.region.topMenu);

            this.$el.attr({
                id: this.model.getDataId()
            });

            return this;

        },
        inject: function() {

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            // parallel these task
            this.fetchData();

            utils.helper.addActivityExtraBlock(this.model, this.$activityExtraHolder, this.$scroller);

            return this;
        },
        fetchData: function() {

            var sendData = {
                iVideoId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('video/detail', sendData, settings).done(this.fetchDataComplete).fail(function() {
                utils.debug.log(arguments);
            });
        },
        fetchDataComplete: function(data) {
            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message);
            } else {
                this.model.set(data);
                this.updateView();
            }
        },
        fetchDataFail: function(error, msg) {

            msg = msg || _t('Could not fetch data');

            utils.modal.alert(msg);
        },
        updateView: function() {

            if (!this.model.canView()) {
                return this.$el.html(utils.helper.privatepage());
            }

            this.$topMenuBtn.removeClass('hide');

            this.$el.find('#page_title').html(this.model.getTitle());

            this.$detailHolder.html(this.templateDetail({
                item: this.model
            }));

            if (this.model.isInProcess() || (this.model.getVideoType() == 'file' && !this.model.getVideoUrl())) {
                this.$el.find('#video_in_process').removeClass('hide');
            }

            if (this.model.getEmbedHtml() != '') {
                var sEmbed = this.model.getEmbedHtml();

                var video_width = this.$el.find('.item-wrapper').width() - 10;
                // fix responsive video 16:9 is default
                sEmbed = sEmbed.replace(/width=(\".*?\")/, 'width="' + video_width + '"').replace(/height=(\".*?\")/, 'height="' + (video_width * 9 / 16) + '"');

                var $iframe_holder = this.$el.find('#video_embed_iframe');
                $iframe_holder.html(sEmbed).removeClass('hide');
                $iframe_holder.find('iframe').bind('load', function() {
                    var $iframe = $(this);
                    setTimeout(function() {
                        $iframe.contents().find('.yt-uix-button-menu').remove(); // remove YouTube Context Menu
                    }, 500);
                });
            }

            if (!this.model.isInProcess() && this.model.getVideoUrl()) {
                var src = this.model.getVideoUrl();

                this.$mp4VideoPlayer = this.$el.find('#mp4_uploaded_player');
                this.$mp4VideoPlayer.html('<video controls id="video_player_control"><source src="' + src + '" type="video/mp4"></video>');
                this.$mp4VideoPlayer.removeClass('hide');
            }

            this.$activityExtraHolder.removeClass('hide');
        },
        toggleTopMenu: function() {
            utils.topMenu.toggle(this, this.model);
        },
        doDeleteConfirm: function() {

            var self = this;

            utils.modal.confirm(_t('Are you sure to delete this video?'), function(result) {
                if (result == 1) {
                    self.doDelete();
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
            // BUGS https://jira.younetco.com/browse/SEMOBI-1610
        },
        doDelete: function() {

            utils.observer.trigger('blockui');
            var sendData = {
                iVideoId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.post('video/delete', sendData, settings)
                .always(function() {
                    utils.observer.trigger('releaseui');
                })
                .done(function(data) {
                    if (data.error_code && data.error_code > 0) {
                        this.doDeleteFail(data);
                    } else {
                        this.doDeleteSuccess(data);
                    }
                })
                .fail(function() {
                    this.doDeleteFail();
                });
        },
        doDeleteSuccess: function(data) {
            utils.modal.toast(data.message);
            utils.history.back();
        },
        doDeleteFail: function(data) {
            utils.modal.alert(data.error_message || _t('Can not load data from server'));
        }
    });
});