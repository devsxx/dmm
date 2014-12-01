define([
    'chat/view/message-list',
    'chat/view/message-post',
], function() {
    var ListView = require('chat/view/message-list')
      , PostView = require('chat/view/message-post')

    return {
        region: {
			main: '#chat-detail-view-holder',
			content: '#right_content',
			scroller: '#right_content',
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

			this.$el.find('#message').focus();

            $('#page_title').html(this.model.getName());
			
			return this;
		},
    }
    
});
