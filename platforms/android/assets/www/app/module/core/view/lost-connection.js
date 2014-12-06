define([
	'text!core/tpl/lost-connection.html'
],function(text){
	
	return Backbone.View.extend({
		region: {
			main: '#main',
			content: '#content'
		},
        events: {
            'click .refresh': 'retry'
        },
		template: _.template(text),
		render: function(context){
			
			this.context  = $.extend({}, context);
			
			this.$el.html(this.template(this.context));
            this.$refresh = $('.refresh', this.$el);
            this.$refreshIcon = $('.refresh i', this.$el);
			
			return this;
		},
		inject: function(){
			
			$(this.region.main).html(this.$el);

            var viewer = localStorage.getItem("viewer");
            var sidebar= localStorage.getItem("sidebar");
             alert(viewer);
             alert(sidebar);
            if(viewer.length > 0 && sidebar.length > 0){
                alert("viewer and sidebar present!");
                        setTimeout(function(){
                            window.location.href="#newsfeed";// there may have cached feeds << Nay 
                        },1000);
            }else {
                window.location.href="#login";
            }

			return this;
		},
        retry: function() {
            if (this.isProcessing) return ;
            var self = this;

            var data = {
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };

            utils.api.post('core/ping', data, settings).done(this.postDone).always(this.postComplete);
        },
        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            var self = this;
            setTimeout(function() {
                self.$refreshIcon.removeClass('processing');
                self.isProcessing =  false;
            }, 1000);
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$refreshIcon.addClass('processing');
            this.isProcessing = true;
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            window.location = '#home';
        },

	});	
});
