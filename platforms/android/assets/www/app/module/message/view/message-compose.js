define([
    'message/view/friend-list',
    'photo/view/attachment-album-photo-item',
    'photo/view/photo-add-actions',
    'text!message/tpl/friend-selected-item.html',
    'text!message/tpl/message-compose.html'
], function(FriendListView, AttachmentPhotoItemView, PhotoAddActionsView, SelectFriendTpl, text) {

    return Backbone.View.extend({

        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        selectFriendTpl: _.template(SelectFriendTpl),
        initialize: function() {
            this.aSelectedFriend = [];
        },
        render: function(context) {

            this.context = $.extend({}, context);

            this.$el.attr('id', 'message_compose');

            this.$el.html(this.template(this.context));

            //init jquery variable
            this.$autocompleteHolder = $('#autocomplete_mail_to_holder', this.$el);
            this.$attachmentHolder = $('#compose_message_attachment_holder', this.$el);
            this.$photo_add_btn = $('#photo_add_btn', this.$el);
            this.$postBtn = $('#post_message_btn', this.$el);
            this.$to = $('#mail_to_user', this.$el);
            this.$subject = $('#subject', this.$el);
            this.$message = $('#message', this.$el);

            // bind input edit, paste events
            var self = this;
            this.$subject.bind('input propertychange', function() {
                self.toggleBtn();
            });
            this.$message.bind('input propertychange', function() {
                self.toggleBtn();
            });

            return this;

        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            // add selected friend
            if (this.context.iUserId) {
                this.addSelectedFriend(this.context.iUserId);
            }

            // friend autocomplete list
            this.friendListView = new FriendListView({},
                this.$autocompleteHolder,
                this.$autocompleteHolder, {
                    loadmore: false,
                    loadnew: false,
                    input: this.$to
                }
            );

            this.friendListView.render().inject();

            return this;
        },
        events: {
            'click #photo_add_btn': 'onAddPhotoClick',
            'click #post_message_btn': 'post',
            'click .close_button': 'removeAttachment',
            'click #wrap_mail_to_user': 'focusToInput',
            'click .friend-item': 'selectFriend',
            'click .friend_search_remove': 'removeFriend',
            'keyup #mail_to_user': 'searchFriends',
            'touchend': 'hideAutocomplete',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto'
        },
        onAddPhotoClick: function(evt) {

            new PhotoAddActionsView().render({
                delegateId: this.$el.attr('id')
            }).inject();
        },
        capturePhoto: function() {

            var self = this;

            navigator.device.capture.captureImage(onSuccess, onFail, {
                limit: 1
            });

            function onSuccess(mediaFiles) {
                var imageURI = mediaFiles[0].fullPath;
                self.addPhotoItem(imageURI);
            }

            function onFail(msg) {
                utils.debug.warn(msg);
            }
        },
        browsePhoto: function() {

            var self = this;

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation: true
            });

            function onSuccess(imageURI) {
                self.addPhotoItem(imageURI);
            }

            function onFail(msg) {
                utils.debug.warn(msg);
            }
        },
        addPhotoItem: function(path) {

            var self = this;

            var inject = function(dom) {
                self.$attachmentHolder.html(dom);
            };

            new AttachmentPhotoItemView().render({
                PhotoId: 0,
                ImgSrc: path
            }).inject(inject);

            this.$photo_add_btn.addClass('hide');
        },
        removeAttachment: function() {

            this.$attachmentHolder.empty();

            this.$photo_add_btn.removeClass('hide');
        },
        focusToInput: function(evt) {

            this.$to.focus();
        },
        searchFriends: function(evt) {

            if (!this.$to.val().trim()) {
                return;
            }

            this.$autocompleteHolder.removeClass('hide');

            var newQueryTime = +new Date();

            if (newQueryTime - this.friendQueryTime < 200) {
                return;
            }

            this.friendQueryTime = newQueryTime;

            var newQuery = $.extend({}, this.friendQuery, {
                sSearch: this.$to.val()
            });

            this.friendListView.resetQuery(newQuery);
        },
        hideAutocomplete: function(evt) {

            if (!this.$autocompleteHolder.is(evt.target) // if the target of the click isn't the container...
                && this.$autocompleteHolder.has(evt.target).length === 0) // ... nor a descendant of the container
            {
                this.$autocompleteHolder.addClass('hide');
            }
        },
        selectFriend: function(evt) {

            this.$autocompleteHolder.addClass('hide');

            var $target = $(evt.currentTarget);
            var item = {
                iId: $target.data('id'),
                sTitle: $target.data('title')
            };

            if (this.aSelectedFriend.indexOf(item.iId) == -1) {
                this.aSelectedFriend.push(item.iId);
                this.$to.parent().before(this.selectFriendTpl(item));
            }

            this.toggleBtn();

            this.$to.val('');
            this.$to.attr('placeholder', '');
            this.$to.focus();
        },
        addSelectedFriend: function(iUserId) {

            // disable input
            this.$to.attr({
                placeholder: _t('Loading friends...'),
                disabled: true
            });

            // get friend detail
            utils.api.get('profile/detail', {
                iUserId: iUserId
            }, {
                context: this
            }).done(function(data) {
                if (data.error_code && data.error_code > 0 || !data.BasicInfo) {
                    this.$to.attr('placeholder', _t('To'));
                    return utils.modal.alert(_t('Can not load selected friend'));
                }

                var item = {
                    iId: data.BasicInfo.iUserId,
                    sTitle: data.BasicInfo.sFullName
                };

                this.aSelectedFriend.push(item.iId);
                this.$to.parent().before(this.selectFriendTpl(item));

                this.$to.attr('placeholder', '');
            }).always(function() {
                this.$to.removeAttr('disabled');
            });
        },
        removeFriend: function(evt) {

            var $target = $(evt.currentTarget);
            var iId = $target.data('id');

            $target.parent().remove();

            var index = this.aSelectedFriend.indexOf(iId);
            this.aSelectedFriend.splice(index, 1);

            if (this.aSelectedFriend.length == 0) {
                this.$to.attr('placeholder', _t('To'));
            }

            this.toggleBtn();
        },
        post: function() {
            if (this.$postBtn.hasClass('processing')) {
                return false;
            }

            if (!this.isValidate(true)) {
                return false;
            }

            var data = {
                'sUserIds': this.aSelectedFriend.join(),
                'sSubject': this.$subject.val(),
                'sText': this.$message.val()
            };
            var settings = {
                'context': this,
                'beforeSend': this.beforeSend
            };

            var attachmentPhoto = this.$attachmentHolder.find('.attachment-photo-image');

            if (attachmentPhoto.length > 0 && attachmentPhoto.data('src')) {
                this.sendMessageWithPhoto(data, settings, attachmentPhoto.data('src'));
            } else {
                utils.api.post('message/compose', data, settings).done(this.postDone).always(this.postComplete);
            }
        },
        sendMessageWithPhoto: function(data, settings, imageURI) {

            var self = this;

            function done(result) {
                if (result.sImagePath != null) {
                    self.handleUploadPhotoSuccess(data, settings, result);
                } else {
                    utils.modal.alert(result.error_message || _t('Can not upload file(s). Please try again later.'));
                    utils.debug.warn('[FAIL] message/attach', result);
                }
            };

            function fail(err) {
                utils.debug.warn('[FAIL] message/attach', err);
            };

            utils.api.uploadImage('message/attach', imageURI, {}).done(done).fail(fail);
        },
        handleUploadPhotoSuccess: function(data, settings, result) {
            data['sText'] = data['sText'] + ' ' + result.sImagePath;
            data['attachmentData'] = {
                "type": "photo"
            };
            utils.api.post('message/compose', data, settings).done(this.postDone).always(this.postComplete);
        },
        toggleBtn: function() {

            var bDisable = !this.isValidate();

            this.$postBtn.toggleClass('disabled', bDisable);
        },
        isValidate: function(bAlert) {

            if (this.aSelectedFriend.length == 0 && !this.context.iParentId) {
                bAlert && utils.modal.alert('Please choose a recipient');
                return false;
            }

            if (this.$subject.val().trim() == '') {
                bAlert && utils.modal.alert('Please enter the subject');
                return false;
            }

            if (this.$message.val().trim() == '') {
                bAlert && utils.modal.alert('Please enter the message');
                return false;
            }

            return true;
        },
        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.$postBtn.removeClass('processing');
        },
        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$postBtn.addClass('processing');
        },
        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if (data.error_code > 0) {
                utils.modal.alert(data.error_message);
                return false;
            } else {
                this.postSuccess();
            }
        },
        /** 
         * It should be called when the response has error_code == 0
         */
        postSuccess: function() {

            utils.modal.toast('Send message successfully');
            window.location = '#messages/sent';
        },
    });
});