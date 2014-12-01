define(function(){
	return Backbone.Model.extend({
		idAttribue: 'iReportId',
		defaults: {
			sModelType: 'report',
			bCanLike: false,
			bCanShare: false
		}
	});
});
