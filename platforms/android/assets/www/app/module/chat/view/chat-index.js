define([
    'text!chat/tpl/chat-index.html',
    'chat/view/chat-list',
    'chat/view/chat-search',
    'chat/view/chat-topmenu',
    'core',
    'chat/collection/chat',
    'chat/view/chat-detail'
], function() { 
    var text = require('text!chat/tpl/chat-index.html')
      , ListView = require('chat/view/chat-list')
      , SearchView = require('chat/view/chat-search')
      , core = require('core')
      , ChatCollection = require('chat/collection/chat')
      , ChatDetailView = require('chat/view/chat-detail')

    var ChatIndex = Backbone.View.extend({
        template: _.template(text),
        region: {
			holder: '#main',
			scroller: '#content'
		},
        initialize: function() {
            if(constants.chatCollection) {
                this.collection = constants.chatCollection;
            } else {
                this.collection = new ChatCollection();

                constants.chatCollection = this.collection;

            }

            utils.observer.on('chat:show-latest-conversation', function() {
                this.showLatestConversation();
            }, this);

        },
		topMenuView: require('chat/view/chat-topmenu'),
        render: function(query){
			
			this.$el.html(this.template());
			
			return this;
			
		},
		inject: function(){
			
			var $holder = $(this.region.holder).html(this.$el);
			
			this.$scroller = $(this.region.scroller);
			
			this.$scroller.ensureVerticalScroll(); // enable scrollable
			// render search iew
			
			this.listView = new ListView({}, 
				this.$el.find('#friend-list-view-holder'),
			 	this.$scroller,
			  	{
                    loadmore: false,
                    loadnew: false,
                    collection: this.collection
                }
			  ).render().inject().startChatlistUpdater().startPing();

            this.listView.on('view:rerender', this.searchFriend,  this);

			new SearchView().render().inject();
			
            this.updateViewerChatStatus();

			return this;
		},

        showLatestConversation: function() {
            var that = this;

            if(this.collection.length > 0) {
                this.displayLatest();
            } else {
                this.collection.listenToOnce(this.listView, 'view:load-complete', function() {
                    that.displayLatest();
                })
            }
        },

        displayLatest: function() {
            var latestChat = this.collection.max(function(item) {
                return item.hasNewMessage() ? item.getLastMessageTimestamp() : 0;
            });

            if(!latestChat.hasNewMessage()) return;

            if(latestChat) {
                // $('#' + latestChat.getDataId('detail')).click();
                // console.log('detail-datat', latestChat.getDataId('detail'));
                new ChatDetailView({model: latestChat}).render().inject();
            }
        },

		events: {
			//"click #search_icon": "searchFriend",
			'keyup #search_keywords': 'searchFriend',
			'click #menu_toggle': 'toggleMenu'
		},

        toggleMenu: function() {
        	utils.topMenu.toggle(this, core.viewer);
        },

		searchFriend: function () { //@todo: xai tam, chinh lai sau
	        if ($('.friend-item').length == 0) {
	        	return;
	        }
	        
	        $('#not_found').addClass("hide");
	        
	        var count = 0;
	        
	        var val = $.trim($('#search_keywords').val()).replace(/ +/g, ' ').toLowerCase();
	        
	        $('.friend-item').each(function () {
	            $(this).removeClass("hide");
	            
	            var text = $(this).find('.item-headline').text().replace(/ +/g, ' ').toLowerCase();
	            
	            if (!~text.indexOf(val)) {
	            	$(this).addClass("hide");
	            } else {
	            	count ++;
	            }
	        });
	        
	        if (count == 0) {
	        	$('#not_found').removeClass("hide");
	        }
		},

        updateViewerChatStatus: function() {
            var data = {
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSendUpdate
            };

            utils.api.post('chat/getstatus', data, settings).done(this.postUpdateDone).always(this.postUpdateComplete);
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postUpdateComplete: function() {
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSendUpdate: function() {
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postUpdateDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postUpdateSuccess(data);
            }
        },

        /** 
         * It should be called when the response has error_code == 0 
         */
        postUpdateSuccess: function (data) {
            core.viewer.set('sChatStatus', data['sStatus']);
        },
    });

    return ChatIndex;
});

