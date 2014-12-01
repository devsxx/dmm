define([
	'report/model/report'
],function(ReportModel){
	return Backbone.Collection.extend({
		model: ReportModel
	});
});
