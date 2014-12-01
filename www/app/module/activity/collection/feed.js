define(['activity/model/feed'],function(model){
	var Collection = Backbone.Collection.extend({
		model: model,
		url: constants.apiURL+"feed/get"
	});
	return Collection;
});
