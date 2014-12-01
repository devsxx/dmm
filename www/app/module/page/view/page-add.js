define([
    'page/model/page',
    'text!page/tpl/page-add.html',
    'text!page/tpl/page-add-form.html',
    'text!page/tpl/page-attachment-photo.html'
], function(Model, text, formText, textAttachmentPhoto){

    return Backbone.PolyplatformView.extend({
        moduleId: 'page/view/page-add',
        region: {
            holder: '#main',
            scroller: '#content',
            formHolder: '#page-add'
        },
        template: _.template(text),
        formTemplate: _.template(formText),
        events:{
//            "click #form_avatar_browse": "browsePhoto",
//            "click #form_cover_browse": "browsePhoto",
//            "click #page_form_photo_remove": "removePhoto",
            "click #save_btn": "saveData"
        },
        render: function() {

            this.$el.html(this.template());

            this.$el.attr('id', 'page_add');

            this.$form_holder = this.$el.find(this.region.formHolder);

            return this;
        },

        inject: function() {

            var self = this;

            this.$holder = $(this.region.holder);

            this.$holder.html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll();

            // get page creation data (privacy settings, categories
            this.fetchData();

            return this;
        },

        fetchData: function() {

            utils.api.get('pages/formadd', {}, {
                context: this
            }).done(this.fetchDataComplete).fail(this.fetchDataFail);
        },

        fetchDataComplete: function(data) {

            if (data.error_code && data.error_code > 0) {

                utils.modal.alert(data.error_message || _t('Can not load data from server'));

                return utils.history.back();
            }

            this.formData = data;

            this.updateView();
        },

        fetchDataFail: function() {

            utils.debug.log(arguments);

            utils.history.back();
        },

        updateView: function() {

            var self = this;

            this.$form_holder.html(this.formTemplate(this.formData));

            var $typeOptions = this.$('#page_form_type');

            var $categoryOptions = this.$('#page_form_category');

            // update category list when type is changed
            $typeOptions.change(function() {
				/* var html='<option value="">'+_t('select_a_category')+'</option>'+_.each(category_options[0].sub_categories, function (subCat){
                     +'<option value="'+subCat.category_id+'">'+subCat.name+'</option>';
					//$categoryOptions.append(new Option(subCat.category_id, subCat.category_id));
					
                });
				$categoryOptions.append(html); 
				*/	
                $categoryOptions.empty();

                $categoryOptions.append(new Option(_t('select_a_category'), ''));

                _.each(_.findWhere(self.formData.category_options, {type_id: this.value}).sub_categories, function(subCat){
                   $categoryOptions.append("<option value="+subCat.category_id+">"+subCat.name+"</option>");
				//$categoryOptions.append(new Option(subCat.name, subCat.category_id));
                });
            });
        },

        // upload data for new page
        saveData: function (){

            // do nothing if the button is clicked
            if ($('#save_btn').hasClass("processing")) {
                return;
            }

            var page_title = $('#page_form_title').val();   // sTitle
            var page_info = $('#page_form_info').val();  // sInfo
            var page_type = $('#page_form_type').val();         // iTypeId
            var page_category = $('#page_form_category').val(); // iCategoryId

            if (!page_title) {

                utils.modal.alert(_t('Page name cannot be empty.'));

                $('#page_form_title').focus();

                return;
            }

            var data = {
                "sTitle": page_title,
                "sInfo": page_info,
                "iTypeId": page_type,
                "iCategoryId": page_category
            };

            var settings = {
                "beforeSend": this.beforeSend,
                "complete": this.completeSend
            };

            utils.api.post('pages/create', data, settings).done(this.saveDone).fail(this.saveFailed);
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
            utils.modal.toast("Page has been created successfully.");

            utils.history.back();
        },
        saveFailed: function(data){

            utils.debug.log(arguments);
        }

    });
});