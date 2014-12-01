define([
    'text!photo/tpl/photo-edit.html'
], function(text) { 
	
    return Backbone.View.extend({
        template: _.template(text),
        events: {
            'click #save_photo': 'savePhoto'
        },
        render: function() {
            // I always think the context is too ambiguous
            this.$el.html(this.template({item: this.model}));

            this.$title = $('#title', this.$el);
            this.$description = $('#description', this.$el);
            this.$postBtn = $('#save_photo', this.$el);
            return this;
        },

        inject: function() {
            utils.popup.open(this.$el);
        },
        savePhoto: function() {

            if (this.$postBtn.isProcessing()) return;

            if(!this.isValidate()) {
                return ;
            }

            var data = {
                "iPhotoId": this.model.getId(),
                "sItemType": this.model.getType(),
                "sTitle": this.$title.val(),
                "sDescription": this.$description.val()

            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('photo/edit', data, settings).done(this.postDone).always(this.postComplete);
            
        },
        
        isValidate: function() {
            if(this.$title.val().trim() == '') {
                utils.modal.alert(_t('Please provide title for your photo'));
                return false;
            }

            return true;

        },

       /**
        * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
        */
       postComplete: function() {
           this.$postBtn.isProcessing(false);
           this.$postBtn.val(_t('Save'));
       },

       /**
        * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
        */
       beforeSend: function() {
           this.$postBtn.isProcessing(true);
           this.$postBtn.val(_t('Saving...'));
       },

       /**
        * It is called when having a response returned.
        * Note that it will not be called if server returns status !== 200
        */
       postDone: function(data, status, jqXHR) {
           if(data.error_code > 0) {
               utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
               return false;
           } else {
               this.postSuccess(data);
           }
       },

       /** 
        * It should be called when the response has error_code == 0 
        */
       postSuccess: function (data) {
           utils.popup.close();
           utils.modal.toast(_t('Edit photo successfully'));
           this.model.set( {
               'sTitle': this.$title.val(),
               'sDescription': this.$description.val()
           });

       },
       
    });
});

