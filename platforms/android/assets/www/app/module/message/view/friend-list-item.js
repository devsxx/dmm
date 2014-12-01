define([
    'text!message/tpl/friend-list-item.html'
], function() {
    var tplText = require('text!message/tpl/friend-list-item.html');
    
    var FriendListItem = Backbone.View.extend({
        template: _.template(tplText),
        tagName: "li",

        className: "list_user_send",
        
        render: function (context) {
            this.context = $.extend({}, context);
            
            $(this.el).html(this.template(this.context));

            return this;
        }
    });

    return FriendListItem;
});
