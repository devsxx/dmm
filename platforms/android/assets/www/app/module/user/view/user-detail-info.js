define([
    'text!user/tpl/user-detail-info.html',
    'text!user/tpl/user-detail-info-update.html',
    'activity/view/activity-list',
    'activity/view/activity-minibar',
    'user/view/user-basic-info',
    'user/view/private-page',
    'user/view/user-topmenu',
], function(text, textUpdate) {

    var ActivityListView = require('activity/view/activity-list'),
        MinibarView = require('activity/view/activity-minibar'),
        BasicInfo = require('user/view/user-basic-info'),
        PrivatePage = require('user/view/private-page');

    return Backbone.ItemView.extend({
        region: {
            wrapper: '#main',
            scroller: '#content',
            infoHolder: '#user-profile-info',
            activityHolder: '#activity-list'
        },
        initialize: function() {
            this.model.on('change', this.updateMenu, this);

            // extend super method.
            Backbone.ItemView.prototype.initialize.apply(this, arguments);

        },
        events: {
            'block': 'onBlockClick',
            'click #menu_toggle': 'toggleMenu',
            'editavatar': 'onEditAvatar',
            'editcover': 'onEditCover'
        },
        moduleId: 'user/view/user-detail-info',
        className: 'user-profile-page',
        template: _.template(text),
        templateUpdate: _.template(textUpdate),
        topMenuView: require('user/view/user-topmenu'),
        render: function(context) {

            this.$el.html(this.template(context));

            this.$scroller = this.$el.find(this.region.scroller);

            this.$infoHolder = this.$el.find(this.region.infoHolder);

            this.$activityHolder = this.$el.find(this.region.activityHolder);

            this.$menuBtn = this.$el.find('#menu_toggle');

            this.$el.attr({
                id: this.model.getDataId()
            });

            return this;

        },
        inject: function() {

            $(this.region.wrapper).html(this.$el);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();


            return this;
        },

        toggleMenu: function(evt) {
            utils.topMenu.toggle(this, this.model);
        },
        updateMenu: function() {
            // this.$menu.html(this.templateTopMenu({model: this.model}));
        },
        onBlockClick: function(evt) {
            var self = this;
            var $target = $(evt.currentTarget);

            if ($target.hasClass('processing')) {
                return;
            }

            var isBlocked = this.model.isBlocked();
            var message = isBlocked ? _t('Do you want to un-block this member') : _t('Do you want to block this member');
            var api = isBlocked ? 'user/unblock' : 'user/block';
            var sendData = {
                iUserId: this.model.getId()
            };

            utils.modal.confirm(message, function(result) {
                if (result === 1) {
                    $target.addClass('processing');

                    utils.api.post(api, sendData)
                        .done(function(data) {
                            utils.popup.close();

                            if (data.error_code && data.error_code > 0) {
                                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
                            }

                            self.blockSuccess(data);
                        })
                        .always(function() {
                            $target.removeClass('processing');
                        });
                }
            }, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        },
        blockSuccess: function(data) {
            var isBlocked = !this.model.isBlocked();
            this.model.set({
                isBlocked: isBlocked,
                isFriend: false,
                isSentRequest: false,
                isSentRequestBy: false
            });

            this.toggleMenu();
            utils.modal.toast(isBlocked ? _t('Block successfully') : _t('Un-block successfully'));
        },
        fetchData: function() {

            var sendData = {
                iUserId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('profile/detail', sendData, settings)
                .done(this.fetchDataDone)
                .fail(this.fetchDataFail);
        },
        fetchDataDone: function(data) {
            if (data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                var userData = data.BasicInfo;
                userData.aContacts = data.Details;
                userData.sAboutMe = data.About_Me ? data.About_Me.About_Me : '';
                this.model.set(userData);
                this.refreshView();
            }
        },
        fetchDataFail: function() {
            utils.debug.error(arguments);
        },
        refreshView: function() {

            if (!this.model.canView()) {
                this.$infoHolder.html(utils.helper.permission_deny());
                return;
            }

            this.$menuBtn.removeClass('hide');

            this.$infoHolder.html(this.templateUpdate({
                item: this.model
            }));

            this.$activity_minibar_holder = this.$el.find('#activity_minibar_holder');
            this.$user_detail_menu_holder = this.$el.find('#user_detail_menu_holder');

            if (this.model.canViewWall() && this.model.canShareOnWall()) {
                this.$activity_minibar_holder.removeClass('hide');

                new MinibarView().render({
                    sItemType: this.model.getType(),
                    iItemId: this.model.getId(),
                    exclude: this.model.isOwner() ? [] : ['checkin'],
                }).inject();
            }

            if (this.model.canViewProfileInfo() || this.model.canViewPhoto() || this.model.canViewFriend()) {
                this.$user_detail_menu_holder.removeClass('hide');
            }

            new BasicInfo({
                model: this.model
            }).render().inject();

            if (this.model.canViewWall()) {
                this.$activityHolder.removeClass('hide');

                this.listView = new ActivityListView({}, this.$activityHolder, this.$scroller, {
                    loadnew: false,
                    loadmore: true
                });

                this.listView.render({
                    sItemType: this.model.getType(),
                    iItemId: this.model.getId()
                }).inject();
            }
        },
        onEditAvatar: function() {

            var href = '#user-edit-photo/';

            this.browsePhoto(href);
        },
        onEditCover: function() {

            var href = '#user-edit-cover/';

            this.browsePhoto(href);
        },
        browsePhoto: function(href) {

            utils.popup.isShown() && utils.popup.close();

            var self = this;

            var onSuccess = function(imageURI) {
                href += self.model.getId() + '/' + btoa(imageURI);
                window.location.href = href;
            };

            var onFail = function(msg) {
                utils.debug.log(msg);
            };

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            });
        }
    });
});