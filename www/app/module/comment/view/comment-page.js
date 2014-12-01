define([
	'text!comment/tpl/comment-page.html'
], function(text) {
	return Backbone.View.extend({
		region : {
			wrapper : '#main-bottom',
			scroller : '#content-bottom',
			listViewHolder : '#comment-list',
			activityExtraHolder: '#activity_extra_holder',
		},
		events : {
			"click #btn_back" : "closeComment"
		},
		template : _.template(text),
		render : function() {

			this.$el.html(this.template({
				item : this.model
			}));

			this.$listViewHolder = $(this.region.listViewHolder);
			this.$scroller = this.$el.find(this.region.scroller);
			this.$activityExtraHolder = this.$el.find(this.region.activityExtraHolder);

			return this;

		},
		inject : function() {

			$(this.region.wrapper).html(this.$el);

			this.$scroller.ensureVerticalScroll();
			
			utils.helper.addActivityExtraBlock(this.model, this.$activityExtraHolder, this.$scroller);

			utils.observer.trigger('bottom:open');
		},
		closeComment : function() {
			utils.observer.trigger('bottom:close');
		}
	});
});

