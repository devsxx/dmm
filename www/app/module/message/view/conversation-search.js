define([
	'text!message/tpl/conversation-search.html'
], function(text){
	
	return Backbone.View.extend({
		region: {
			holder: '#search_view_holder'
		},
		className: 'search-area',
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template());
			
			this.$keywordInput  = this.$el.find('#search_keywords');
			this.$advSearchHolder = this.$el.find('#adv_search_holder');
			
			return this;
		},
		inject: function(){
			
			
			$(this.region.holder).html(this.$el);
			
			return this;
		},
		events: {
			"click #search_icon": "submitSearch",
            'click #adv_search_toggle_btn': 'toggleSearch'
		},
        toggleSearch: function() {
            this.$advSearchHolder.toggleClass('hide');
        },
		submitSearch: function () {
			
			// this.$advSearchHolder.addClass('hide');
			
			this.trigger('submit',{
				sSearch: this.$keywordInput.val() || ''
			});
		}
	});
	
});
