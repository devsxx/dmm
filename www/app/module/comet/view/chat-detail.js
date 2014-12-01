define([
    'text!comet/tpl/chat-detail.html',
    'comet/view/message-list',
    'comet/view/message-post',
    'comet/ipad/view/chat-detail'
], function() { 
    var text = require('text!comet/tpl/chat-detail.html')
      , ListView = require('comet/view/message-list')
      , PostView = require('comet/view/message-post')

    var ChatDetail = Backbone.PolyplatformView.extend({
        template: _.template(text),
        moduleId: 'comet/view/chat-detail',
        region: {
			main: '#main-bottom',
			content: '#content-bottom',
		},
        initialize: function() {
            this.skipUpdater = false;
            this.model.setCurrent();
            that = this;
            $(document).one("backbutton", function () { // Android
                that.model.set('bIsCurrent', false);
                $(document.body).scrollTop(0);
            });
        },
        render: function(query){

            this.query = $.extend({
				iItemId: this.model.getId(),
                sItemType: this.model.getType()
			}, query);

            this.$holder =  $(this.region.main);
			
			this.$el.html(this.template({
                item: this.model
            }));
			
			this.$scroller =  this.$el.find(this.region.content);
			
			return this;
			
		},
		events: {
			"click #btn_back":"closeDetailPage"
		},
		inject: function(){
			
            this.$holder.html(this.$el);
            
           
            
            var height = this.$el.find('.swiper-container').height();
            
            this.$el.find('.swiper-slide').css({minHeight: height + 1});
			
			new ListView({}, 
				this.$el.find('#message-list-view-holder'),
			 	this.$scroller,
			  	{
                    loadmore: false,
                    loadnew: true,
                    collection: this.model.getMessages()
                }
			  ).render(this.query).inject();

            new PostView({model: this.model}).render().inject();
            
             this.$scroller.ensureVerticalScroll();

			utils.observer.trigger('bottom:open');
			
			var $message  = this.$el.find('#message');
			
			$message.on('focus',function(){
				window.setTimeout(function(){
					$(document.body).scrollTop(2000)
				},200);
			});
			
			$message.focus();
			
			return this;
		},
        closeDetailPage: function(){
			utils.observer.trigger('bottom:close');
            this.model.set('bIsCurrent', false);
		},
    });

    return ChatDetail;
});

