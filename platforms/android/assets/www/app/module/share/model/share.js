define(function(){
	return Backbone.Model.extend({
		idAttribute: 'iShareId',
		defaults: {
			sModelType: 'activity_share'
		}
	});
});
