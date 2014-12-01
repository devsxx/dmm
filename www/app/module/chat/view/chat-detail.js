define([
    'text!chat/tpl/chat-detail.html',
    'chat/view/message-list',
    'chat/view/message-post',
    'chat/ipad/view/chat-detail'
], function() { 
    var text = require('text!chat/tpl/chat-detail.html')
      , ListView = require('chat/view/message-list')
      , PostView = require('chat/view/message-post')

    var ChatDetail = Backbone.PolyplatformView.extend({
        template: _.template(text),
        moduleId: 'chat/view/chat-detail',
        region: {
			main: '#main-bottom',
			content: '#content-bottom',
		},
        initialize: function() {
            this.skipUpdater = false;
            this.model.setCurrent();
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
			
			this.$el.find('#message').focus();
			
			return this;
		},
        closeDetailPage: function(){
			utils.observer.trigger('bottom:close');
            this.model.set('bIsCurrent', false);
		},


    });

    return ChatDetail;
});

