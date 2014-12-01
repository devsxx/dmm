define([
	'photo/view/photo-item',
	'photo/model/photo'
],function(ItemView, Model)
{
	function loadData(query, view, option)
	{
		utils.api.get('photo/filter',query)
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
			
			delete(data);
			
			view.addItems(items, option);
			
			delete(items);
			
		}).fail(function()
		{
			utils.debug.log(arguments);
		});
	}
	
	
	return Backbone.View.extend({
		region: {
			main: '#main',
			content: '#content',
			list: '#photo-list'
		},
		isFirst: true,
		template: null,
		render: function(context){
			
			this.context = $.extend({
				iPage: 1
				, sItemType: null
				//iUserId: null,
				, iInDetails: 1
				, filterByOpt: "recent"
				, iAmountOfPhoto: 10
			}, context);
			
			this.isFirst = true;
			
			return this;
			
		}

		,inject: function(){
			var self = this;
			
			var content = $(this.region.content);
			
			self.loadmore();
									
			content.on('loadmore:load',function(){
				self.loadmore();
			}).on('loadnew:load',function(){
				self.loadnew();
			});
		}

		,updateContext: function(context){

			this.context = $.extend({
				iPage: 1
				, sItemType: null
				//iUserId: null,
				, iInDetails: 1
				, sOrder: "recent"
				, iAmountOfPhoto: 10
				, sAction: null
			}, context);
		}

		,reset: function(){
			this.context.iPage = 1;
			$(this.region.list).empty();
			this.loadmore();
		}
		
		,loadmore: function(){
			if(!this.isFirst)
            	this.context.sAction = 'more';

			loadData(this.context, this, 'loadmore');
		}, 
		loadnew: function(){
			if(!this.isFirst)
            	this.context.sAction = 'new';
            
           	this.context.iPage = 1;
			
			loadData(this.context, this, 'loadnew');
		}, 
		addItems: function(items, option){
			
			var list = $(this.region.list);
			
			var content = $(this.region.content);
						
			if(this.isFirst){
				this.isFirst = false;
				content.find('.loading-initiator').remove();
			}
			
			utils.debug.log(items);

			if(items.length > 0 && option == 'loadmore') this.context.iPage += 1;
			
			function inject(dom){
				list[option == 'loadmore'?'append':'prepend'](dom);
			}
			
			_.each(items,function(item){
				var album_id = '#photo_id_'+item.getId();
				if(!$(album_id).length)
					new ItemView().render(item).inject(inject);
			});
			
			content
			.trigger(option+ ':end')
			.trigger('refresh')
			.data('ready',true);
		}
	});
});

