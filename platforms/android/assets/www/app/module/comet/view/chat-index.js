define([
    'text!comet/tpl/chat-index.html',
    'comet/view/chat-list',
    'comet/view/chat-search',
    'comet/view/chat-topmenu',
    'core',
    'comet/collection/chat',
    'comet/view/chat-detail',
    'comet/view/chat-setting'
], function() { 
    var text = require('text!comet/tpl/chat-index.html')
      , ListView = require('comet/view/chat-list')
      , SearchView = require('comet/view/chat-search')
      , core = require('core')
      , ChatCollection = require('comet/collection/chat')
      , ChatDetailView = require('comet/view/chat-detail')
      , ChatSettingView = require('comet/view/chat-setting')
     ;

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
            this.collection.clearCurrentStatus(); // fix iphone does not update chat status.

            utils.observer.on('comet:show-latest-conversation', function() {
                this.showLatestConversation();
            }, this);

        },
		topMenuView: require('comet/view/chat-topmenu'),
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
        	
        	var latestChat =  false;
        	
        	_.each(this.collection.models, function(item){
        		if(!latestChat && item.hasNewMessage()){
        			latestChat = item;
        		}
        	});
        	
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
        	var status = localStorage.getItem('cometchat_status');
        	
        	if(!status){
        		status = 'available';
        	}
        	
        	core.viewer.status  =  status;
        	core.viewer.mute = !localStorage.getItem('cometchat_notification');
       
        	// open top menu view
        	new ChatSettingView({
        		model: core.viewer
        	}).render().inject();
        	//utils.topMenu.toggle(this, core.viewer);
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

            utils.api.cometPost('chat/getstatus', data, settings).done(this.postUpdateDone).always(this.postUpdateComplete);
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

