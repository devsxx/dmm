define([
	'activity/model/feed',
	'activity/view/activity-item',
	'text!activity/tpl/activity-list.html'
],function(Model, ItemView, text){
	
	var CHECK_NEW_STORIES_INTERVAL = 90*1e3;
	
	return Backbone.View.extend({
		region: {
			main: '#main',
			content: '#content',
			list: '#activity-list'
		},
		isFirst: true,
		template:  _.template(text),
		render: function(context){
			this.context = $.extend({
				iAmountOfFeed: 10,
				iMaxId: 0,
				iMinId: 0,
				iItemId: null,
				sItemType: null,
				checkNewStory: false, // check new stories - in newsfeeds
				$elCheckNewStory: false // check new stories element - in newsfeeds.
			}, context);
			
			
			this.$el.html(this.template());
			
			this.isLoadingNew = false;
			this.isFirst = true;
			this.checkNewStoryProcessId  = 0;
				
			return this;

		},
		inject: function(){
			
			var self = this;
			
			var content = $(this.region.content);
						
			self.loadmore();
			
			content.on('loadmore:load',function(){
				self.loadmore();
			}).on('loadnew:load',function(){
				self.loadnew();
			});
			
			var list = $(this.region.list);
			
			list.html(this.$el);
			
			this.destroyCheckNewStoryProcess();
			
			if(this.context.checkNewStory){
				window.checkNewStoryProcessId  = window.setInterval(function(){
					self.checkNewStory();
				}, CHECK_NEW_STORIES_INTERVAL);
			}
		},
		updateNewStory: function(number)
		{
			var $el  =  this.context.$elCheckNewStory;
			
			if(!$el){
				return false;
			}
			
			if(utils.history.getCurrentUrl() != '#newsfeed'){
				
				this.destroyCheckNewStoryProcess();
				
				return false;
			}
			
			if(number){
				var string = number + ' ' + (number >1 ? 'stories': 'story');
				$el.find('span').html(string);
				$el.removeClass('hide');
			}else{
				$el.addClass('hide');	
			}
		},
		checkNewStory: function(){
			
			// check network connection for any interval task.
			if(!this.context.checkNewStory)
			{
				return false;
			}
			
			if(this.isLoadingNew){
				return ;
			}
			
			if(utils.history.getCurrentUrl() != '#newsfeed'){
				this.destroyCheckNewStoryProcess();
				return false;
			}
			
			var sendData = {
					iMinId: this.context.iMinId
				}, self = this;
			
			if(sendData.iMinId < 1){
				return false;
			}
			
			utils.api.get('feed/getupdate', sendData)
			.done(function(data){
				if(data.iTotalFeedUpdate){
					self.updateNewStory(data.iTotalFeedUpdate);	
				}
			})
			.fail(function(){
				
			});
		},
		loadData: function (query, option)
		{
			var self = this;
			
			utils.api.get('feed/get',query)
			.done(function(data)
			{
				if(data.hasOwnProperty('error_code') && data.error_code)
				{
					if(data.hasOwnProperty('error_message'))
					{
						utils.modal.alert(data.error_message);
					}else
					{
						utils.modal.alert('Unknown errors');
					}
				}
				
				var items  = data.map(function(item){
					return new Model(item);
				});
				
				self.addItems(items, option);
				
				delete(items);
				
			}).fail(function()
			{
				utils.debug.log(arguments);
			});
		},
		loadmore: function(){
			this.loadData({
				iAmountOfFeed: this.context.iAmountOfFeed,
				iMaxId: this.context.iMaxId,
				iItemId: this.context.iItemId,
				sItemType: this.context.sItemType
			},'loadmore');
			
			return this;
		},
		loadnew: function(){
			this.isLoadingNew = true;
			
			if(this.context.checkNewStory && this.context.$elCheckNewStory){
				this.context.$elCheckNewStory.addClass('hide');
			}
			
			
			this.loadData({
				iItemId: this.context.iItemId,
				sItemType: this.context.sItemType,
				iAmountOfFeed: this.context.iAmountOfFeed,
				iMinId: this.context.iMinId
			},'loadnew');
			
			return this;
		},
		addItems: function(items, option){
			
			if(option == 'loadnew'){
				this.isLoadingNew = false;
			}
			
			var list  =  $(this.region.list);
			
			var content = $(this.region.content);
			
			var self = this;
			
			var len = items.length;
			
			if(this.isFirst)
			{
				this.isFirst = false;
				list.find('.loading-initiator').remove();	
				
				if(!len){
					return ;
				}
			}
			
			var	inject = function(dom)
			{
				list[option == 'loadmore'?'append':'prepend'](dom);
			}
			
			_.each(items,function(item)
			{	
				new ItemView({model: item}).render().inject(inject);
			});
			
			if(len && (option == 'loadmore' || this.context.iMaxId == 0))
			{
				var last = items.pop();
				this.context.iMaxId = last.getId() -1;
			}
			
			if(len && (option == 'loadnew' || 0 == this.context.iMinId)){
				var first = items[0];
				this.context.iMinId  = first.getId() + 1;
			}
			
			content
			.trigger(option+ ':end')
			.trigger('refresh')
			.data('ready',true);
			
		},
		destroyCheckNewStoryProcess: function(){
			if(window.checkNewStoryProcessId){
				window.clearInterval(window.checkNewStoryProcessId);
				window.checkNewStoryProcessId =0;
			}
		}
	});
});
