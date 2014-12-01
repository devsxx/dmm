define(function(){
	return Backbone.Model.extend({
		idAttribute: '',
		defaults: {
			sModelType: 'dislike',
            iDislikeId   : 0,
            iUserId   : 0,
            sFullName : '',
            sImage    : ''
		}
	});
});
