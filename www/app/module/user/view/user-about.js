define([
    'text!user/tpl/user-about.html',
    'text!user/tpl/user-extend-info.html',
    'user/view/user-basic-info',
    'user/view/user-topmenu'
], function() { 
    var tpl = require('text!user/tpl/user-about.html')
     ,  extendTpl = require('text!user/tpl/user-extend-info.html')
     ,  BasicInfo = require('user/view/user-basic-info')
     ,  TopMenuView  = require('user/view/user-topmenu')
     ;     
    return Backbone.View.extend({
        template: _.template(tpl),
        topMenuView: TopMenuView,
        events: {
            'click #menu_toggle': 'toggleMenu'
        },
		region:{
			wrapper: '#main',
			scroller: '#content'
		},
        render: function() {
        	
            this.$el.html(this.template({item: this.model}));

			this.$scroller  = this.$el.find(this.region.scroller);
			
            return this;
        },

        inject: function() {
			
			$(this.region.wrapper).html(this.$el);
			
			this.$scroller.ensureVerticalScroll();
			
            this.fetchData();

            return this;
        },

        fetchData: function() {
            var data = {
                iUserId: this.model.getId()
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('profile/detail', data, settings)
            .done(this.postDone)
            .always(this.postComplete);
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if(data.error_code && data.error_code > 0) {
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
        	
        	this.model.set(data.BasicInfo);

            this.model.set('sAboutMe', data.About_Me ? data.About_Me.About_Me : '');
            
            new BasicInfo({
            	model: this.model
            }).render()
            .inject();

            this.$el.find('#user-extend-info', this.$el).html(_.template(extendTpl)({
                item: this.model
            }));
            
            this.$scroller.trigger('refresh');
        },

        toggleMenu: function(e){
			utils.topMenu.toggle(this, this.model);
        }
    });
});

