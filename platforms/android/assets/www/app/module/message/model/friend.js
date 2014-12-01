define(function() {
	return Backbone.Model.extend({
		idAttribute : 'id',
		defaults : {
			'sModelType' : 'user'
		},
        getTitle: function () {
            return this.get('sFullName');
        },
        getFormatedTitle : function() {
			var sTitle = this.getTitle();
            var sSearch = this.get('sSearch');
            
            if (sTitle && sSearch) {
                var patt = new RegExp('(' + sSearch + ')', 'ig');
                return sTitle.replace(patt, '<strong>$1</strong>');
            }
            
            return sTitle;
		},
		getImgSrc : function() {
			return this.get('UserProfileImg_Url') || '';
		}
	});
});
