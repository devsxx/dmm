define([
    'marketplace/model/listing-photo',
    'marketplace/view/listing-add-photo-item',
    'photo/view/photo-add-actions',
    'text!marketplace/tpl/country-childs.html',
    'text!marketplace/tpl/listing-edit-form.html',
    'text!marketplace/tpl/listing-edit.html'
], function(ListingPhotoModel, AttachmentAddPhotoItem, PhotoAddActionsView, textCountryChilds, textForm, text) {

    return Backbone.View.extend({
        className: 'listing-edit',
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#listing_edit_form_holder'
        },
        template: _.template(text),
        templateCountryChilds: _.template(textCountryChilds),
        templateForm: _.template(textForm),
        render: function(context) {

            this.context = $.extend({
                iItemId: null,
                sModule: null
            }, context);

            this.$el.attr('id', 'listing_edit');

            this.$el.html(this.template(this.context));

            this.$form_holder = this.$el.find(this.region.formHolder);
            this.$save_btn = this.$el.find('#save_btn');
            this.$edit_info_btn = this.$el.find('#edit_info_btn');
            this.$edit_photo_btn = this.$el.find('#edit_photo_btn');

            this.aCategoryId = [];
            this.aPhotoUpload = [];

            return this;
        },
        inject: function() {

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            this.fetchData();

            return this;
        },
        fetchData: function() {

            var postData = {
                iListingId: this.model.getId()
            };
            var settings = {
                context: this
            };

            utils.api.get('marketplace/formedit', postData, settings).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },
        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {
                utils.modal.alert(data.error_message || _t('Can not load data from server'));
                return utils.history.back();
            }

            this.formData = data;
            this.model.set(data);
            this.updateView();
        },
        updateView: function(data) {

            this.aCategoryId = this.model.getCategoryIds();

            this.$form_holder.html(this.templateForm({
                context: this.context,
                data: this.formData,
                item: this.model
            }));

            this.$attachment_photo_holder = this.$el.find('#attachment_photo_holder');
            this.$edit_info_holder = this.$el.find('#listing_edit_info_holder');
            this.$edit_photo_holder = this.$el.find('#listing_edit_photo_holder');
            this.$form_city = this.$el.find('#listing_form_city');
            this.$form_country = this.$el.find('#listing_form_country');
            this.$form_country_childs_holder = this.$el.find('#listing_form_country_childs_holder');
            this.$form_currency = this.$el.find('#listing_form_currency');
            this.$form_description = this.$el.find('#listing_form_description');
            this.$form_mini_description = this.$el.find('#listing_form_mini_description');
            this.$form_price = this.$el.find('#listing_form_price');
            this.$form_privacy = this.$el.find('#listing_form_privacy');
            this.$form_privacy_comment = this.$el.find('#listing_form_privacy_comment');
            this.$form_sell = this.$el.find('#listing_form_sell');
            this.$form_title = this.$el.find('#listing_form_title');
            this.$form_zipcode = this.$el.find('#listing_form_zipcode');
            this.$photo_add_btn = this.$el.find('#photo_add_btn');

            // update sub categories
            if (this.model.getCategoryIds()[0]) {
                var $form_category = this.$el.find('.listing-form-category');
                this.appendSubCategories($form_category, this.model.getCategoryIds());
            }

            // update country childs
            if (this.$form_country.val()) {
                this.fetchChilds(this.model.getCountryChildId());
            }

            // append photos
            if (this.model.hasPhotos()) {
                this.appendPhotos();
            }

            // bind input edit, paste events
            var self = this;
            this.$el.find('input').bind('input propertychange', function() {
                self.toggleSaveBtn();
            });
			this.$scroller.trigger('refresh');
        },
        appendPhotos: function() {

            var aPhoto = this.model.getPhotos();

            _.each(aPhoto, function(photo) {
                this.getPictureSuccess(photo.sImagePath, photo.iImageId);
            }, this);
        },
        fetchDataFail: function() {
            utils.debug.warn('FAIL: marketplace/formedit', arguments);
            utils.history.back();
        },
        events: {
            'change #listing_form_country': 'onChangeCountry',
            'change .listing-form-category': 'onChangeCategory',
            'click #edit_info_btn': 'onInfoBtnClick',
            'click #edit_photo_btn': 'onPhotoBtnClick',
            'click #photo_add_btn': 'onAddPhotoClick',
            'click #save_btn': 'onSaveClick',
            'onCamera': 'capturePhoto',
            'onGallery': 'browsePhoto'
        },
        onChangeCountry: function(evt) {

            this.toggleSaveBtn();

            this.$form_country_childs_holder.empty();

            if (this.$form_country.val()) {
                this.fetchChilds();
            }
        },
        fetchChilds: function(selected) {

            var postData = {
                sCountryIso: this.$form_country.val()
            };
            var settings = {
                context: this
            };

            this.ajaxChilds && this.ajaxChilds.abort();

            this.ajaxChilds = utils.api.get('core/getchilds', postData, settings).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return utils.modal.alert(data.error_message || _t('Can not load country childs'));
                }

                this.updateChilds(data, selected);
            }).fail(function() {
                utils.debug.warn('FAIL: core/getchilds', arguments);
            });
        },
        updateChilds: function(data, selected) {

            if (data.length > 0) {
                this.$form_country_childs_holder.html(this.templateCountryChilds({
                    data: data,
                    selected: selected || 0
                }));
            }
        },
        onChangeCategory: function(evt) {

            var $target = $(evt.currentTarget);

            var $subs_holder = $target.parent().children('.listing-form-category-subs-holder');

            $subs_holder.empty();

            this.updateCategories();

            this.toggleSaveBtn();

            if ($target.val()) {
                this.appendSubCategories($target);
            }
        },
        updateCategories: function() {

            this.aCategoryId = [];

            var $form_category = this.$el.find('.listing-form-category');

            _.each($form_category, function(item) {
                if ($(item).val()) {
                    this.aCategoryId.push($(item).val());
                }
            }, this);
        },
        appendSubCategories: function($target, aSelected) {

            var subCategoriesHtml = utils.helper.getSubCategoriesHtml(this.formData.category_options, $target.val(), aSelected);

            var $subs_holder = $target.parent().children('.listing-form-category-subs-holder');

            $subs_holder.html(subCategoriesHtml);
        },
        onInfoBtnClick: function(evt) {

            this.$edit_photo_btn.removeClass('current');
            this.$edit_info_btn.addClass('current');
            this.$edit_photo_holder.addClass('hide');
            this.$edit_info_holder.removeClass('hide');
        },
        onPhotoBtnClick: function(evt) {

            this.$edit_info_btn.removeClass('current');
            this.$edit_photo_btn.addClass('current');
            this.$edit_info_holder.addClass('hide');
            this.$edit_photo_holder.removeClass('hide');
        },
        onAddPhotoClick: function(evt) {

            new PhotoAddActionsView().render({
                delegateId: this.$el.attr('id')
            }).inject();
        },
        capturePhoto: function(evt) {
            var self = this;

            navigator.device.capture.captureImage(captureImageSuccess, captureImageFail, {
                limit: 1
            });

            function captureImageSuccess(mediaFiles) {
                var sImgSrc = mediaFiles[0].fullPath;
                self.getPictureSuccess(sImgSrc);
            }

            function captureImageFail(error) {
                utils.debug.log(error);
            }
        },
        browsePhoto: function(evt) {
            var self = this;

            navigator.camera.getPicture(getPictureSuccess, getPictureFail, {
                quality: 10,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            });

            function getPictureSuccess(imageURI) {
                self.getPictureSuccess(imageURI);
            }

            function getPictureFail(msg) {
                utils.debug.log(msg);
            }
        },
        getPictureSuccess: function(fileURI, id) {

            var item = new ListingPhotoModel({
                iImageId: id || 0,
                sImagePath: fileURI
            });

            this.appendAttachmentItem(item, AttachmentAddPhotoItem, this.$attachment_photo_holder);
        },
        appendAttachmentItem: function(item, View, $holder) {

            if (!item.getId()) {
                this.aPhotoUpload.push(item.getPhotoUrl());
            }

            var attachmentItem = new View({
                model: item
            });

            var context = {
                postDelete: item.getId() > 0 ? true : false
            };

            var inject = function(dom) {
                $holder.append(dom);
            };

            attachmentItem.render(context).inject(inject);

            attachmentItem.on('removesuccess', this.removeAttachmentItem, this);
        },
        removeAttachmentItem: function(item) {

            var index = this.aPhotoUpload.indexOf(item.getPhotoUrl());
            if (index > -1) {
                this.aPhotoUpload.splice(index, 1);
            }
        },
        onSaveClick: function(evt) {

            (this.aPhotoUpload.length > 0) ? this.uploadPhotos(evt) : this.saveListing(evt);
        },
        uploadPhotos: function(evt) {

            if (this.$save_btn.hasClass('processing')) {
                return;
            }

            if (!this.validateData(true)) {
                return;
            }

            this.uploadPhotoData = {
                success_count: 0,
                error_message: _t('Can not upload photo(s). Please try again later.'),
                postData: {
                    iListingId: this.model.getId()
                }
            };

            this.uploadPhoto(0);
        },
        uploadPhoto: function(index) {

            var self = this;

            utils.api.uploadImage('marketplace/photoupload', this.aPhotoUpload[index], this.uploadPhotoData.postData).done(function(data) {
                self.uploadPhotoDone(data, index);
            }).fail(function() {
                self.uploadPhotoFail(arguments, index);
            });
        },
        uploadPhotoDone: function(data, index) {

            if (data.error_code && data.error_code > 0) {
                this.uploadPhotoData.error_message = data.error_message || this.uploadPhotoData.error_message;
            } else {
                this.uploadPhotoData.success_count++; // will ignore errors if have any success photos
            }

            this.uploadPhotoComplete(index);
        },
        uploadPhotoFail: function(arguments, index) {

            utils.debug.warn('FAIL: marketplace/photoupload ' + index, arguments);

            this.uploadPhotoComplete(index);
        },
        uploadPhotoComplete: function(index) {

            if (index >= this.aPhotoUpload.length - 1) {
                (this.uploadPhotoData.success_count > 0) ? this.saveListing() : utils.modal.alert(this.uploadPhotoData.error_message);
            } else {
                this.uploadPhoto(index + 1);
            }
        },
        saveListing: function(evt) {

            if (this.$save_btn.hasClass('processing')) {
                return;
            }

            if (!this.validateData(true)) {
                return;
            }

            var $form_country_childs = this.$el.find('#listing_form_country_childs');

            var postData = {
                iListingId: this.model.getId(),
                aCategoryId: this.aCategoryId,
                sTitle: this.$form_title.val(),
                sCountryIso: this.$form_country.val(),
                sPrice: this.$form_price.val(),
                sMiniDescription: this.$form_mini_description.val(),
                sDescription: this.$form_description.val(),
                sCurrencyId: this.$form_currency.val(),
                iIsSell: this.$form_sell.val(),
                iAutoSell: 0,
                iCountryChildId: $form_country_childs.length > 0 ? $form_country_childs.val() : 0,
                sCity: this.$form_city.val(),
                sPostalCode: this.$form_zipcode.val(),
                iPrivacy: this.$form_privacy.val(),
                iPrivacyComment: this.$form_privacy_comment.val(),
                sEmails: '',
                sPersonalMessage: '',
            };

            var settings = {
                context: this
            };

            this.$save_btn.addClass('processing');

            utils.api.post('marketplace/edit', postData, settings).done(this.saveDone).always(function() {
                this.$save_btn.removeClass('processing');
            });
        },
        saveDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }

            var message = this.$edit_info_btn.hasClass('current') ? _t('Listing successfully updated.') : _t('Successfully uploaded images.');
            utils.modal.toast(message);

            window.location.href = '#listing/' + data.iListingId;
        },
        validateData: function(bAlert) {

            if (this.aCategoryId.length == 0) {
                bAlert && utils.modal.alert(_t('Provide a category this listing will belong to.'));
                return false;
            }

            if (!this.$form_title.val().trim()) {
                bAlert && utils.modal.alert(_t('Provide a name for this listing.'));
                return false;
            }

            if (!this.$form_price.val().trim()) {
                bAlert && utils.modal.alert(_t('Provide a valid price.'));
                return false;
            }

            if (!this.$form_country.val()) {
                bAlert && utils.modal.alert(_t('Provide a location for this listing.'));
                return false;
            }

            return true;
        },
        toggleSaveBtn: function(evt) {

            var bDisable = !this.validateData();

            this.$save_btn.toggleClass('disabled', bDisable);
        }
    });
});