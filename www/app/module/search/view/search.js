define([
	'text!search/tpl/search.html'
],function(text){

	return Backbone.View.extend({
		region:{
			searchbox: "#searchbox"
		},
		className: 'search-item',
		template: _.template(text),
		render: function(context){
        	this.context = $.extend({
        		bAdvanced: true,
        		sPlaceHolder: _t('Keywords...')
        	}, context);

        	this.$el.html(this.template(this.context));
			return this;
		},
		inject: function(){
        	$(this.region.searchbox).append(this.el);
		},
        events: {
        	"click #adv_search_toggle_btn": "toggleAdvSearch",
        	'click #search-button': 'doSearch'
        },
        toggleAdvSearch: function (evt) {
			$('#adv_search_holder').toggleClass("hide");
		},
        doSearch: function(){
        	this.context.callBack($('#search-textbox-item').val());
        }
	});
});
