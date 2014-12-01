define([
	'text!activity/tpl/newsfeed.html',
	'activity/view/activity-list',
	'activity/view/activity-minibar',
	'activity/view/activity-newstory'
],function(text, ListView, MiniBarView){
	
	var NewStoryView  = require('activity/view/activity-newstory');
	
	return Backbone.View.extend({
		region: {
			holder: '#main',
		},
		className: 'newsfeed-page',
		template : _.template(text),
		render : function(context) {
			
			this.context = $.extend({}, context);
			
			this.$el.html(this.template(context));
			
			this.$scroller = this.$el.find('#content');
			
			return this;
		},
		inject: function(){
			
			$(this.region.holder).html(this.$el);
			
			this.$scroller.ensureVerticalScroll();
						
			var $elCheckNew =  this.$el.find('#newsfeed_new_story_stage');
			
			this.listView  = new ListView({},this.$el.find('#activity-list'), this.$scroller, {
				loadmore: true,
				loadnew: true,
				checknew: true,
				$elCheckNewStory: $elCheckNew
			}).render().inject();
			
			this.miniBarView = new MiniBarView().render().inject();
			
			this.newStoryView = new NewStoryView({}, 
				this.$el.find('#newstory_view_holder'),
			 	this.$scroller
			 ).render().inject();

			
			return this;
		},
		events: {
			'click #newsfeed_new_story_stage': 'loadNew'
		},
		loadNew: function(evt){
			this.$el.find('#newsfeed_new_story_stage').addClass('hide');
			this.$el.find('#content').trigger('loadnew:start').trigger('loadnew:load');
		}
	});
});