define([
    'text!share/tpl/share-this.html',
    'share/view/share-wall'
],function(text,shareWallView){
    return Backbone.View.extend({
        template: _.template(text), // need to be over write
        render: function(){
            this.$el.html(this.template({item: this.model}));
            return this;
        },
        events: {
            'click .share-to-wall': 'shareToWall',
            'click .share-to-social': 'shareSocial'
        },
        inject: function(){
            
            utils.popup.open(this.$el);
            
            
            return this;
        },
        
        shareToWall: function(){
            (new shareWallView({model: this.model})).render().inject();
        },
        shareSocial: function(){
            window.plugins.socialsharing.share(null,null,[],encodeURI(this.model.getSocialShareUrl()),function(){
                utils.modal.toast('Shared successful!');
            }, function(){
                console.log(JSON.stringify(arguments));
            });
            utils.popup.close();
        }
    });
});
