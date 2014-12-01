define([
    'CONTROLLER_PLAYER',
	'text!music/tpl/playlist-detail.html',
    'text!music/tpl/playlist-detail-update.html',
	'music/collection/song',
    'music/view/playlist-topmenu'
], function(CONTROLLER_PLAYER, text, textUpdate, SongCollection, TopMenuView) {
	
	var SongCollection = require('music/collection/song');
	    
	return Backbone.DetailView.extend({
		template : _.template(text),
		templateUpdate: _.template(textUpdate),
        topMenuView: TopMenuView,
		initialize: function(){
			this.model.songs =  new SongCollection();
			Backbone.DetailView.prototype.initialize.apply(this, arguments);

            $(document).one("backbutton", function () {

                var music = $('audio').attr('src', '').get(0);
                music.load();
                music.play();
                music.pause();

            });
		},
		region: {
			wrapper: '#main',
			scroller: '#content',
			activityExtraHolder: '#activity_extra_holder',
		},
		events: {
			'click #top_menu_toggle': 'toggleTopMenu',
		},
		toggleTopMenu: function() {
			utils.topMenu.toggle(this, this.model);
		},
        render : function() {
        	
			this.$el.html(this.template({item: this.model}));
			
			this.$activityExtraHolder = this.$el.find(this.region.activityExtraHolder);
			
			this.$scroller =  this.$el.find(this.region.scroller);
            
            this.$topMenuBtn = this.$el.find('#top_menu_toggle');
			
			this.$el.attr({id: this.model.getDataId()});
			
			return this;			
		},
		inject: function(){
			
			$(this.region.wrapper).html(this.$el);
			
			this.$scroller.ensureVerticalScroll();
			
			this.fetchData();
			
			return this;
		},
		fetchData: function(query){
			var iAlbumId =  this.model.getId();
			var self = this;
			
			this.errMsg1 = "";
			this.errMsg2 = "";
			
			var $ajax1  = utils.api.get('album/detail',{iAlbumId: this.model.getId()}, {context: this})
				.done(function(data){
					if(data.error_code && data.error_code > 0){
						self.errMsg1 = data.error_message;
						return;
					}
					this.model.set(data);									
				}).fail(function(){
					utils.debug.log(arguments);
				});
			
			var $ajax2 = utils.api.get('album/list_songs',{iAlbumId: this.model.getId()},{context: this})
				.done(function(data){
					if(data.error_code && data.error_code > 0){
						self.errMsg2 = data.error_message;
						return;
					}
					this.model.songs.add(data);
				});
				
			$.when($ajax1, $ajax2).done(function(){
				self.updateView();
			}).fail(function(){
				
			});
		},
		updateView: function(){
			
			// cannot get album detail
			if (this.errMsg1 != "") {
				utils.modal.alert(this.errMsg1);
				return;
			}
			
			// don't have view permission
			if (!this.model.canView()) {
				this.$el.find('#page_title').html(_t('Private Page'));
				this.$scroller.html(utils.helper.permission_deny());
				return;
			}
			
			// cannot get song list
			if (this.errMsg2 != "") {
				utils.modal.alert(this.errMsg1);
				return;
			}
            
            if (!this.model.isOwner()) {
                this.$topMenuBtn.removeClass('hide');
            }
			
			this.$el.find('#page_title').html(this.model.getAlbumName());
			
			this.$el.find('#music-playlist-detail')
			.html(this.templateUpdate({songs: this.model.songs, item: this.model}));
			
			// load extra block after have model to check permission
			utils.helper.addActivityExtraBlock(this.model, this.$activityExtraHolder, this.$scroller);
			
			this.$activityExtraHolder.removeClass('hide');
			
			if(this.model.songs.length){
				var firstSong =  this.model.songs.at(0);
				// Init Player with a song
				this.$el.find('#id_player').html('<audio src="'+firstSong.getSongPath()+'" width="100%" autoplay="false"></audio>');
	            this.$el.find('#listsong li').first().addClass('current'); // require to initialize
	            
	            CONTROLLER_PLAYER.initialize();
	            
	            this.$el.find('.mejs-prev-button').addClass('disabled');
			}else{
				this.$el.find('.music-player').first().addClass('no-songs');
			}
		}
	});
});
