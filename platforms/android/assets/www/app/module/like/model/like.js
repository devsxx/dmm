define(function(){
	return Backbone.Model.extend({
		idAttribute: '',
		defaults: {
			sModelType: 'like',
            iLikeId   : 0,
            iUserId   : 0,
            sFullName : '',
            sImage    : ''
		}
	});
});
