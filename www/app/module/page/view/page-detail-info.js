define([
    'page/view/page-item',
    'page/view/page-more-menu',
    'page/view/page-top-menu',
    'page/view/user-list-popup',
    'text!page/tpl/page-detail-info-update.html',
    'text!page/tpl/page-detail-info.html'
], function(ItemView, MoreMenuView, TopMenuView, UserListPopupView, textInfoUpdate, text) {

    return ItemView.extend({
        moduleId: 'page/view/page-detail-info',
        region: {
            holder: '#main',
            scroller: '#content'
        },
        className: 'page-detail-page',
        template: _.template(text),
        topMenuView: TopMenuView,
        templateInfoUpdate: _.template(textInfoUpdate),
        render: function() {
            // define region variables

            this.$el.attr({
                id: this.model.getDataId()
            });

            this.$el.html(this.template({
                item: this.model
            }));

            this.$holder = $(this.region.holder);

            this.$scroller = this.$el.find('#content');

            this.$pageTitle = this.$el.find('#page_title');

            this.$detailInfoHolder = this.$el.find('#page_detail_info');

            this.$topMenuBtn = this.$el.find('#top_menu_toggle');

            return this;
        },
        inject: function() {
            // prepare dom

            this.$holder.html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {
            // get data

            var sendData = {
                    iPageId: this.model.getId()
                },
                settings = {
                    context: this
                };

            utils.api.get('pages/info', sendData, settings)
                .done(this.fetchDataComplete)
                .fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {

                utils.modal.alert(data.error_message);

                utils.history.back();
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
                this.$titleLabel.html(_t('Private Page'));
                this.$detailInfoHolder.html(utils.helper.permission_deny());
            }

            this.$pageTitle.html(this.model.getTitle());

            this.$topMenuBtn.removeClass('hide');

            this.$detailInfoHolder.html(this.templateInfoUpdate({
                item: this.model
            }));

            this.$scroller.trigger('refresh');
        },
        deleteSuccess: function(data) {

            utils.modal.toast(data.message);

            utils.history.back();
        },
        events: {
            'click #footer_more_btn': 'showMoreMenu',
            'click #more_admins_btn': 'showMoreAdmins',
            'click #more_members_btn': 'showMoreMembers',
            'click #top_menu_toggle': 'toggleTopMenu',
            'click .action-item': 'updateMemberList'
        },
        showMoreMenu: function(evt) {
            // pass the model to More view
            this.moreMenu = new MoreMenuView({
                model: this.model
            });
            this.moreMenu.render().inject();
        },
        showMoreAdmins: function(evt) {

            var context = {
                type: 'admin',
                items: this.model.getAdminList()
            };

            new UserListPopupView().render(context).inject();
        },
        showMoreMembers: function(evt) {

            var context = {
                type: 'like',
                items: this.model.getMemberList()
            };

            new UserListPopupView().render(context).inject();
        },
        toggleTopMenu: function() {

            utils.topMenu.toggle(this, this.model);

            this.topMenuIsShown(false);
        },
        updateMemberList: function(evt) {

            // @TODO : update user list in realtime
            var self = this;

            setTimeout(function() {
                self.fetchData();
            }, 500);
        }
    });
});