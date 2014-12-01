define([
	'beeber_box',
	'notification/view/notification-box'
],function(beeber_box, BoxView){
	return new beeber_box(BoxView, '#beeber-notification-indicator');
});
