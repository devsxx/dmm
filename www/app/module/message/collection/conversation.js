define([
	'conversation/collection/conversation'
],function(ConversationModel){
	return Backbone.Collection.extend({
		model: ConversationModel
	});
});
