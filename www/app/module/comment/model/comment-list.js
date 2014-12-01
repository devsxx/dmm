define([
    'comment/collection/comment',
], function(CommentCollection) { 
    
    return Backbone.Model.extend( {
        defaults: {
            'aComments'     : new CommentCollection(),
            'iTotalComment' : 0,
            'iItemId'       : 0,
            'sItemType'     : ''
        },
        getTotalComment: function() {
	        return parseInt(this.get('iTotalComment'), 10);
	    },
	    getComments: function() {
	        return this.get('aComments');
	    },
	    getItemType: function() {
	        return this.get('sItemType');
	    },
	    getItemId: function() {
	        return this.get('iItemId');
	    }
    });
});

