define([
	'notification/model/notification',
	'notification/view/notification-box-item',
	'text!notification/tpl/notification-box-list.html',
],function(Model, ItemView, text){

	return Backbone.ListView.extend({
		defaults: {
			iPage: 1,
			iMinId: 0,
			iMaxId: 0,
			iLimit: 10
		},
		followById: true,
		api: 'notification/fetch_notification',
		phraseNotFound: 'အသိေပးခ်က္ မရွိပါ။',
		phraseNotMore: 'အသိေပးခ်က္ အသစ္မရွိပါ။',
		className: 'notification-list',
		template: _.template(text),
		itemModel: Model, 
		itemView: ItemView,
		loadMoreSuccess: function(data){
			var items     = this.parseData(data, this.itemModel);
			var length = items.length;
			var $ele = this.$el;
			var that  = this;
			
			if(this.isFirst){
				if(!length){
					// tell the viewer there is no videos then disable load-more, load-less.
					$ele.html(utils.helper.notfound(_t(this.phraseNotFound)));
				}else{
					$ele.html('');
				}
			}	
			
			this.isFirst = false;
			
			var handleInjectDom = function(dom)
			{
				$ele.append(dom).trigger('injected');
			}
			
			_.each(items,function(item){
                // if notification has message
                if (item.getHeadline()) {
                    that.handleInjectItem(item, handleInjectDom);
                }
			});
			
			if(length && this.followById){
				var id1 = items[length-1].getId();
				var id2 = items[0].getId();
				
				this.query.iMinId  = Math.max(id1,id2,this.query.iMinId);
				this.query.iMaxId  =  this.query.iMaxId > 0 ? Math.min(id1, id2, this.query.iMaxId) : Math.min(id1, id2); 
				
			}else{
				this.query.iPage  =  (this.query.iPage || 0 ) + 1;
			}
			
			
			if(!length){
				// this.$scroller.trigger('loadmore:lock'); // lock or unlock
				if(!this.isFirst){
					if(this.settings.loadmore){
						this.$scroller.trigger('loadmore:lock');  // lock or unlock	
					}
					utils.modal.toast(_t(this.phraseNotMore));
				}
			}else{
				
				if(this.settings.loadmore){
					this.$scroller.trigger('loadmore:unlock'); // lock or unlock
				}
				if(this.settings.loadnew && this.followById){
					this.$scroller.trigger('loadnew:unlock');
				}
				
			}		
			
			this.$scroller
			.trigger('refresh')
			.trigger('query:changed', this.query);
			
			this.$scroller.trigger('loadmore:end');
		}
	});
});
