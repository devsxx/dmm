define([
    'event/view/event-add-update',
    'photo/view/photo-add-actions',
    'text!event/tpl/event-add.html',
    'text!event/tpl/event-attachment-photo.html'
], function(UpdateView, PhotoAddActionsView, text, tplAttachPhoto) {

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({}, context);

            this.$el.attr('id', 'event_add');

            this.$el.html(this.template(this.context));

            return this;
        },
        inject: function() {

            var self = this;

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            utils.api.get('event/formadd').done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    utils.modal.alert(data.error_message || _t('Can not load data from server'));
                    return utils.history.back();
                }

                self.updateView(data);
            }).fail(function() {
                utils.debug.log(arguments);
            });

            return this;
        },
        updateView: function(data) {

            new UpdateView().render({
                data: data
            }).inject();

            this.$photo_browse_btn = this.$el.find('#event_form_photo_browse');
            this.$photo_holder = this.$el.find('#event_form_photo_holder');
        },
        events: {
            "click #event_form_end_date": "handleDates",
            "click #event_form_end_time": "handleTime",
            "click #event_form_photo_browse": "onAddPhotoClick",
            "click #event_form_photo_remove": "removePhoto",
            "click #event_form_start_date": "handleDates",
            "click #event_form_start_time": "handleTime",
            "click #save_btn": "saveData",
            "onCamera": "capturePhoto",
            "onGallery": "browsePhoto",
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
                self.addPhoto(sImgSrc);
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
                self.addPhoto(imageURI);
            }

            function getPictureFail(msg) {
                utils.debug.log(msg);
            }
        },
        addPhoto: function(imageURI) {

            var photo_item = _.template(tplAttachPhoto, {
                imageURI: imageURI
            });

            this.$photo_holder.html(photo_item);

            this.$photo_browse_btn.addClass('hide');
        },
        removePhoto: function() {

            this.$photo_holder.empty();

            this.$photo_browse_btn.removeClass('hide');
        },
        saveData: function(evt) {
            if ($('#save_btn').hasClass("processing")) {
                return;
            }

            // form var
            var event_name = $('#event_form_name').val();
            var event_description = $('#event_form_description').val();
            var event_start_date = $('#event_form_start_date').val();
            var event_start_time = $('#event_form_start_time').val();
            var event_end_date = $('#event_form_end_date').val();
            var event_end_time = $('#event_form_end_time').val();
            var event_location = $('#event_form_location').val();
            var event_category = $('#event_form_category').val();
            var event_privacy = $('#event_form_privacy').val() || "everyone";
            var event_privacy_comment = $('#event_form_privacy_comment').val() || "everyone";

            // validate
            if (!event_name) {
                utils.modal.alert("Event Name is required.");
                return;
            }
            var datePatt = /(\d{4}-\d{2}-\d{2})$/;
            var timePatt = /(\d{2}:\d{2}:\d{2})$/;
            if (!datePatt.test(event_start_date)) {
                utils.modal.alert("Please select start date.");
                return;
            }
            if (!timePatt.test(event_start_time)) {
                utils.modal.alert("Please select start time.");
                return;
            }
            if (!datePatt.test(event_end_date)) {
                utils.modal.alert("Please select end date.");
                return;
            }
            if (!timePatt.test(event_end_time)) {
                utils.modal.alert("Please select end time.");
                return;
            }
            if (!event_location) {
                utils.modal.alert("Location is required.");
                return;
            }

            var event_start = new Date((event_start_date + ' ' + event_start_time).replace(/-/g, '/'));
            var event_end = new Date((event_end_date + ' ' + event_end_time).replace(/-/g, '/'));
            if (event_start.getTime() >= event_end.getTime()) {
                utils.modal.alert("Start time must be before end time.");
                return;
            }

            // passed validate
            var data = $.extend(this.context,{
                "title": event_name,
                "description": event_description,
                "location": event_location,
                "start_date": event_start_date,
                "start_time": event_start_time,
                "end_date": event_end_date,
                "end_time": event_end_time,
                "category_id": event_category,
                "auth_view": event_privacy,
                "auth_comment": event_privacy_comment
            });

            var settings = {
                "beforeSend": this.beforeSave,
                "complete": this.saveComplete
            };

            var event_photo_el = $('#event_form_photo');
            if (event_photo_el.length > 0) {
                var event_photo_src = event_photo_el.data("src");
                this.saveEventWithPhoto(data, settings, event_photo_src);
            } else {
                this.saveEvent(data, settings);
            }
        },
        saveEvent: function(data, settings) {
            utils.api.post('event/create', data, settings).done(this.saveDone);
        },
        saveEventWithPhoto: function(data, settings, path) {
            utils.api.uploadImage('event/create', path, data).done(this.saveDone);
        },
        beforeSave: function() {
            $('#save_btn').addClass("processing");
        },
        saveComplete: function() {
            $('#save_btn').removeClass("processing");
        },
        saveDone: function(data) {
            if (null != data.error_code && 0 != data.error_code) {
                utils.modal.alert(data.error_message);
                return;
            }

            // save success
            utils.modal.toast("Event has been created successfully.");
            window.location.href = "#event-detail/" + data.sModelType + '/' + data.iEventId;
        },
        handleDates: function(evt) {
            var currentField = $(evt.currentTarget);

            var myNewDate = Date.parse(currentField.val().replace(/-/g, '/')) || new Date();
            if (typeof myNewDate === "number") {
                myNewDate = new Date(myNewDate);
            }

            currentField.val(utils.moment(myNewDate.getTime()).format('YYYY-MM-DD'));

            datePicker.show({
                date: myNewDate,
                mode: 'date'
            }, function(returnDate) {
                if (returnDate !== "" && returnDate != "Invalid Date") {
                    var newDate = new Date(returnDate);
                    currentField.val(utils.moment(newDate.getTime()).format('YYYY-MM-DD'));
                }
                currentField.blur();
            });
        },
        handleTime: function(evt) {
            var currentField = $(evt.currentTarget);
            var time = currentField.val();
            var myNewTime = new Date();

            if (/(\d{2}:\d{2}:\d{2})$/.test(time)) {
                myNewTime.setHours(time.substr(0, 2));
                myNewTime.setMinutes(time.substr(3, 2));
            }

            currentField.val(utils.moment(myNewTime.getTime()).format('HH:mm:00'));

            datePicker.show({
                date: myNewTime,
                mode: 'time'
            }, function(returnDate) {
                if (returnDate !== "" && returnDate != "Invalid Date") {
                    var newDate = new Date(returnDate);
                    currentField.val(utils.moment(newDate.getTime()).format('HH:mm:00'));
                }
                currentField.blur();
            });
        }
    });
});