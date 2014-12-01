define(function() { 
    return  Backbone.Model.extend({
        defaults: {
            /**
             * @param {array} aDislikes of object { iUserId -> int, sDisplayName -> string}
             */
            'aDislikes'        : [],
            'bIsDisliked'       : false,
            'iTotalDislike'    : 0,
            'iItemId'       : 0,
            'sItemType'     : ''
        }
    });
});

