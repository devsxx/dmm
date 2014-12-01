define([
	'beeber_box',
	'request/view/request-box'
], function(beeber_box, BoxView){
	return new beeber_box(BoxView, '#beeber-request-indicator');
});