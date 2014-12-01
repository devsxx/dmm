define([
    'page/model/page',
    'text!page/tpl/page-edit.html',
    'text!page/tpl/page-edit-form.html',
    'text!page/tpl/page-attachment-photo.html'
], function(Model, text, formText, textAttachmentPhoto) {

    return Backbone.PolyplatformView.extend({
        moduleId: 'page/view/page-edit',
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#page-edit'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        events: {
            "click #page_form_photo_browse": "browsePhoto",
            "click #page_form_photo_remove": "removePhoto",
            "click #save_btn": "saveData"
        },
        render: function () {

            this.$el.html(this.template());

            this.$el.attr('id', 'page_edit');

            this.$form_holder = this.$el.find(this.region.formHolder);

            return this;
        },

        inject: function () {

            var self = this;

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            // get page data
            this.fetchData();

            return this;
        },

        fetchData: function () {

            utils.api.get('pages/formedit', {
                iPageId: this.model.getId()
            }, {
                context: this
            }).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },

        fetchDataComplete: function (data) {

            if (data.error_code && data.error_code > 0) {

                utils.modal.alert(data.error_message || _t('Can not load data from server'));

                return utils.history.back();
            }

            this.formData = data;

            this.model.set(data);

            this.updateView();
        },

        fetchDataFail: function() {

            utils.debug.log(arguments);

            utils.history.back();
        },

        updateView: function(){

            var self = this;

            this.$form_holder.html(this.formTemplate({
                item: this.model
            }));

            // show cover

            var cover_photo_src = this.model.getCoverImageSrc();

            var cover_photo_holder = $('#page_form_cover_holder');

            if (cover_photo_src) {

                var cover_photo_item = _.template(textAttachmentPhoto, {imageURI: cover_photo_src});

                cover_photo_holder.html(cover_photo_item);

                cover_photo_holder.siblings().hide();
            }

            // show avatar

            var avatar_photo_src = this.model.getAvatarImageSrc();

            var avatar_photo_holder = $('#page_form_avatar_holder');

            if (avatar_photo_src) {

                var avatar_photo_item = _.template(textAttachmentPhoto, {imageURI: avatar_photo_src});

                avatar_photo_holder.html(avatar_photo_item);

                avatar_photo_holder.siblings().hide();
            }

            var $typeOptions = this.$('#page_form_type');

            var $categoryOptions = this.$('#page_form_category');

            // update category list when type is changed
            $typeOptions.change(function() {

                $categoryOptions.empty();

                $categoryOptions.append(new Option(_t('select_a_category'), ''));

                _.each(_.findWhere(self.formData.category_options, {type_id: this.value}).sub_categories, function(subCat){
                    $categoryOptions.append("<option value="+subCat.category_id+">"+subCat.name+"</option>");
					//$categoryOptions.append(new Option(subCat.name, subCat.category_id));
                });
            });
        },

        browsePhoto: function (evt) {

            var self = this;

//            self.addPhoto('asd', evt.target);

            navigator.camera.getPicture(getPictureSuccess, getPictureFail, {
                quality: 10,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            });

            function getPictureSuccess(imageURI) {
                self.addPhoto(imageURI, evt.target);
            }

            function getPictureFail(msg) {
                utils.debug.log(msg);
            }
        },

        addPhoto: function(imageURI, el){

//            var photo_item = _.template(textAttachmentPhoto, {imageURI: "http://www.sandiego.gov/park-and-recreation/graphics/missionhills.jpg"});

            var photo_item = _.template(textAttachmentPhoto, {imageURI: imageURI});

            $(el).siblings().html(photo_item)
            $(el).hide();
        },

        removePhoto: function (evt) {

            utils.modal.confirm(_t('Are you sure?'), function(selected) {

                if (selected == 1) {

                    // show add photo button and remove current image
                    $(evt.target).parent().parent().siblings().show();
                    $(evt.target).parent().parent().empty();
                }
            });
        },

        // save page
        saveData: function () {

            var self = this;

            // do nothing if the button is clicked
            if ($('#save_btn').hasClass("processing")) {
                return;
            }

            // collect data from form elements
            var page_title = $('#page_form_title').val();   // sTitle
            var page_info = $('#page_form_info').val();  // sInfo
            var page_type = $('#page_form_type').val();         // iTypeId
            var page_category = $('#page_form_category').val(); // iCategoryId

            if (!page_title) {
                utils.modal.alert(_t('Page name cannot be empty.'));

                $('#page_form_title').focus();

                return;
            }

            var sendData = {
                "iPageId": this.model.getId(),
                "sTitle": page_title,
                "sInfo": page_info,
                "iTypeId": page_type,
                "iCategoryId": page_category
            };

            // get avatar and upload if found
            var avatar_photo_src = $('#page_form_avatar_holder > div > span').data('src');

            // check if user chose a photo or not
            if (typeof avatar_photo_src !== 'undefined' && avatar_photo_src.substring(0,4) != 'http') {
                var params = {
                    sAction: 'edit',
                    iPageId: this.model.getId()
                }

                utils.api.uploadImage('pages/update_avatar', avatar_photo_src, params).done( function(data){

                    // combine return data and send data
                    $.extend(sendData, data);

                    self.uploadAvatarDone(sendData);
                }).fail(this.uploadFail);
            } else {

                self.uploadAvatarDone(sendData);
            }
        },

        // avatar is uploaded or no need to upload
        uploadAvatarDone: function(sendData) {

            var self = this;

            // get and check cover
            var cover_photo_src = $('#page_form_cover_holder > div > span').data('src');

            if (typeof cover_photo_src !== 'undefined' && cover_photo_src.substring(0,4) != 'http') {

                var params = {
                    sAction: 'edit',
                    iPageId: this.model.getId()
                }

                utils.api.uploadImage('pages/edit_cover', cover_photo_src, params).done( function(data){
                    $.extend(sendData, data);

                    self.uploadCoverDone(sendData);
                }).fail(this.uploadFail);
            } else {

                self.uploadCoverDone(sendData);
            }
        },

        // avatar is uploaded or no need to upload
        uploadCoverDone: function(sendData) {

            var settings = {
                "beforeSend": this.beforeSend,
                "complete": this.completeSend
            };

            utils.api.post('pages/edit', sendData, settings).done(this.saveDone).fail(this.saveFailed);

        },
        uploadFail: function(data) {

        },
        beforeSend: function(){

            $('#save_btn').addClass("processing");
        },
        completeSend: function(){

            $('#save_btn').removeClass("processing");
        },
        saveDone: function(data) {

            if (null != data.error_code && 0 != data.error_code) {
                utils.modal.alert(data.error_message);
                return;
            }

            // save success
            utils.modal.toast("Page has been edited successfully.");

            utils.history.back();
        },
        saveFailed: function(data){

            utils.debug.log(arguments);
        }
    });
});