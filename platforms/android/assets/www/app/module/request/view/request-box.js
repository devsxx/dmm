define([
	'core',
	'text!request/tpl/request-box.html',
	'request/view/request-box-list'
],function(core, text, ListView){
	
	return Backbone.View.extend({
		region: {
			wrapper: '#box-request',
			scroller: '#box-request-content',
			indicator: '#beeber-request-indicator',
			listViewHolder: '#request_list_view_holder'
		},
		template: _.template(text),
		render: function(){

			this.$el.html(this.template());
			
			this.$scroller =  this.$el.find(this.region.scroller);
			this.$listViewHolder = this.$el.find(this.region.listViewHolder);
			
			this.$wrapper = $(this.region.wrapper);
			this.$indicator  =  $(this.region.indicator);
			
			return this;
		},
		inject: function(){
			
			this.$wrapper.html(this.$el);
			
			this.$scroller .ensureVerticalScroll();
			
			this.listView  = new ListView({},
				this.$listViewHolder,
				this.$scroller,
				{loadnew: true, loadmore: false});
				
			this.listView.render().inject();
			
			return this;
		},
		open: function(){
			
			this.$wrapper.addClass('open');
			
			this.$indicator.addClass('active');
			
			this.$indicator.find('.beeber-counter').addClass('hide');
			
			core.updater.setNumberNewRequest(0);
			
			return this;
		},
		close: function(){
			
			var that      = this;
			
			this.$wrapper.removeClass('open');
			
			this.$indicator.removeClass('active');
			
			window.setTimeout(function(){
				that.remove();
			},300);
			
			return this;
		}
	});
});