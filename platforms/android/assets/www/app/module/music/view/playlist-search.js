define([
	'text!music/tpl/playlist-search.html'
], function(text){
	
	return Backbone.View.extend({
		region: {
			holder: '#search_view_holder'
		},
		className: 'search-area',
		template: _.template(text),
		render: function(){
			
			this.$el.html(this.template());
			
			this.$categoryInput = this.$el.find('#search_category');
			this.$orderInput 	= this.$el.find('#search_order');
			this.$keywordInput  = this.$el.find('#search_keywords'); 
			this.$advSearchHolder = this.$el.find('#adv_search_holder');
			
			return this;
		},
		inject: function(){
			
			
			$(this.region.holder).html(this.$el);
			
			// this.fetchData();/
			
			return this;
		},
		fetchData: function(){
			utils.api.get('video/categories',{},{context: this}).done(this.updateView);
		},
		updateView: function(data){
			if (data.error_code) {
				return utils.modal.alert(data.error_message);
			}
			_.each(data, function (option) {
				this.$categoryInput.append(new Option(option.sName, option.iCategoryId));
			}, this);
		},
		events: {
			"click #adv_search_toggle_btn": "toggleAdvSearch",
			"click #search_icon": "submitSearch",
			"click #search_btn": "submitSearch"
		},
		toggleAdvSearch: function (evt) {
			this.$advSearchHolder.toggleClass("hide");
		},
		submitSearch: function () {
			
			this.$advSearchHolder.addClass('hide');
			
			this.trigger('submit',{
				sSearch: this.$keywordInput.val() || '',
				iCategoryId: this.$categoryInput.val() || 0,
				sOrder: this.$orderInput.val() || 'creation_date'
			});
		}
	});
	
});
