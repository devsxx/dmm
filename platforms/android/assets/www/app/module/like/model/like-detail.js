define(function() { 
    return  Backbone.Model.extend({
        defaults: {
            /**
             * @param {array} aLikes of object { iUserId -> int, sDisplayName -> string}
             */
            'aLikes'        : [],
            'bIsLike'       : false,
            'iTotalLike'    : 0,
            'iItemId'       : 0,
            'sItemType'     : ''
        },
        getUserLikes: function() {
            return this.get('aUserLike');
        }
    });
});

