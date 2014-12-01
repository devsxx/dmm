define([
    'page/view/page-item',
    'text!page/tpl/page-detail-activity.html',
    'page/view/page-top-menu',
    'page/view/page-more-menu',
    'activity/view/activity-list',
    'activity/view/activity-minibar'
], function(ItemView, text, TopMenuView, MoreMenuView, ActivityListView, ActivityMiniBarView){

    return ItemView.extend({
        region: {
            holder: '#main',
            content: '#content'
        },
        template: _.template(text),
        className: 'newsfeed-page',
        topMenuView: TopMenuView,
        events: {
            'click #top_menu_toggle': 'toggleTopMenu',
            'click #footer_more_btn': 'showMoreMenu'
//            'click #act_back_btn': 'backToInfo' @TODO back button back to Info properly without back to post status
        },
        render: function () {

            this.$el.html(this.template({item: this.model}));

            this.$el.attr({
                id: this.model.getDataId()
            });

            this.$topMenuBtn = this.$el.find('#top_menu_toggle');

            return this;
        },
        inject: function () {

            var self = this;

            $(this.region.holder).html(this.$el);

            this.$scroller = this.$el.find('#content');

            this.$scroller.ensureVerticalScroll();

            utils.api.get('pages/info', {iPageId: this.model.getId()}, {context: this})
                .done(function(data){
                    if(data.error_code && data.error_code > 0){
                        utils.modal.alert(data.error_message);
                        utils.history.back();
                    }else{
                        this.model.set(data);
                        this.updateView();
                    }
                });

            //get activity
            new ActivityListView({}, this.$el.find('#activity-list'), this.$scroller, {loadnew: true}).render({
                sItemType: 'pages',
                sParentId: 'pages',
                iItemId: this.model.getId()
            }).inject();
        },
        updateView: function(){

            this.$topMenuBtn.removeClass('hide');

            // mini bar
//            if (this.model.canComment()) {
                this.$scroller.addClass('with-topbar');

                new ActivityMiniBarView().render({
                    sItemType: this.model.getType(),
                    iItemId: this.model.getId(),
                    exclude: ['checkin']
                }).inject();
//            }
        },
        toggleTopMenu: function () {

            utils.topMenu.toggle(this, this.model);
            this.topMenuIsShown(false);
        },
        showMoreMenu: function (evt) {

            // pass the model to More view
            this.moreMenu = new MoreMenuView({model: this.model});
            this.moreMenu.render().inject();
        },
        deleteSuccess: function (data) {

            utils.modal.toast(data.message);
            utils.history.back();
        },
        backToInfo: function(){

            utils.history.push(false);

            window.location.href = this.model.getUrl();
        }
    });
});