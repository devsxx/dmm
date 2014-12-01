define([
	'text!activity/tpl/activity-minibar.html',
    'core'
],function(text){
    var core = require('core');

	return Backbone.View.extend({
		region: {
			main: '#activity_minibar_holder',
			content: '#content'
		},
		className: 'activity-minibar',
		template: _.template(text),
        /**
         * @param {object} context { 
         *      sItemType 
         *      iItemId
         *  }
         */
		render: function(context){
            this.context = $.extend({
                sItemType: 'user',
                iItemId: core.viewer.getId(),
                exclude : [] // what item in bar you do NOT want to show
            }, context);
			
			this.$el.html(this.template(this.context));
			
			return this;
		},
		inject: function(){
			
			var main = $(this.region.main);
			
			main.html(this.el);
		}
	});
});
