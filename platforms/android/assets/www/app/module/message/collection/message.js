define([
	'message/model/message'
],function(MessageModel){
	return Backbone.Collection.extend({
		model: MessageModel
	});
});
