define([
	'core',
 	// plugin
 	'activity/plugin/activity',
 	'activity/plugin/activity',
 	// controller
	'activity/controller/newsfeed',
 	'activity/controller/activity-detail',
 	'activity/controller/activity-compose',
 	
 	'activity/view/activity-extra',
 ],function(core) {
 	
 	var ExtraView = require('activity/view/activity-extra');
 	
 	utils.helper.addActivityExtraBlock = function(model, $holder, $scroller){
 		new ExtraView({
 			model: model
 		}, $holder, $scroller)
 		.render().inject();	
 	}
 	
 	core.sidebar.configs.set('new_feed',{
 		icon: 'icon-sidebar-activity',
 		url: '#newsfeed',
 		label: 'News Feed'
 	});
});
