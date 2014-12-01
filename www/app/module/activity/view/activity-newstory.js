define([
	'text!activity/tpl/activity-newstory.html'
],function(text){
	
	return Backbone.View.extend({
		template: _.template(text),
		className: 'activity-new-story',
		api: 'feed/getupdate',
		defaults: {
			iMinId: 0
		},
		query: {},
		interval: 60, // second of interval timeout
		intervalProcessId: 0,
		initialize: function(attrs, $holder, $scroller){
			this.$scroller  = $scroller;
			this.$holder = $holder;
			this.$ajax = false;
			
			var self = this;
			
			this.$scroller
			.on('loadnew:load',function(){
				self.hide();
				self.$scroller.scrollTop(1)	;
			})
			.on('query:changed',function(evt, query){
				if(query.iMinId && query.iMinId +1 != self.query.iMinId){
					self.resetQuery({iMinId: query.iMinId +1 });
				}
			});
		},
		render: function(){
			this.$el.html(this.template({number: 4}));
			return this;
		},
		inject: function(){
			this.$holder.html(this.$el);
			return this;
		},
		hide: function(){
			this.$holder.addClass('hide');
		},
		show: function(){
			this.$holder.removeClass('hide');
		},
		updateView: function(number){
			
			this.$el.html(this.template({number: number}));			

			if(number > 0){
				this.$holder.removeClass('hide');
			}else {
				this.$hodler.addClass('hide');
			}
		},
		events: {
			'click': 'onStickerClick'
		},
		onStickerClick: function(){
			this.$scroller.trigger('loadnew:start').trigger('loadnew:load');
		},
		fetchData: function(){
			if( ! /#newsfeed/.test(utils.history.getCurrentUrl())) return ;
			try{
				this.$ajax && this.$ajax.abort(); // cancel request before.
				if(this.intervalProcessId){
					window.clearTimeout(this.intervalProcessId);
				}
				this.intervalProcessId = 0;	
			}catch(e){
				
			}
			
			this.$ajax = utils.api.get(this.api, this.query, {context: this})
			.done(this.fetchDone)
			.always(this.fetchAlways);
			
		},
		fetchDone: function(data){
			if(data.error_code && data.error_code > 0) return ; // cancel process
			if(data.iTotalFeedUpdate){
				this.updateView(data.iTotalFeedUpdate);
			}
 		},
		fetchAlways: function(){
			
			this.$ajax  = false;
			var self = this;
			
			this.intervalProcessId  =  window.setTimeout(function(){
				self.fetchData();
			}, this.interval * 1e3);
			
		},
		resetQuery: function(query){
			var self = this;
			try{
				this.$ajax && this.$ajax.abort(); // cancel request before.
				if(this.intervalProcessId){
					window.clearTimeout(this.intervalProcessId);
				}
				this.intervalProcessId = 0;	
			}catch(e){
				
			}

			this.query  = $.extend({}, this.defaults, query);
			
			// register to update later.			
			this.intervalProcessId  =  window.setTimeout(function(){
				self.fetchData();
			}, this.interval * 1e3);
		},
	});
});
