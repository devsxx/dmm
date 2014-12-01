define([
	'beeber_box',
	'message/view/message-box'
], function(beeber_box, BoxView){
	return new beeber_box(BoxView, '#beeber-message-indicator');
});