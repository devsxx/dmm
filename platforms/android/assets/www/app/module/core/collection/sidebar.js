define([
	'core/model/sidebar',
], function(SidebarModel){
	
	return Backbone.Collection.extend({
		model: SidebarModel
	});
});
