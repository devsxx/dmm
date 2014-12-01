define([
    'text!event/tpl/event-rsvp.html',
],function(text){
	return Backbone.InlineView.extend({
		template: _.template(text),
		className: 'rsvp-dropdown-stage',
	});
});
