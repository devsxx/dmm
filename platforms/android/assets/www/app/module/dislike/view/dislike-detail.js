define([
    'text!dislike/tpl/dislike-detail.html',
    'dislike/view/dislike-list',
    'dislike/model/dislike-list'
], function(text, DislikeListView, DislikeListModel) { 
    
    return Backbone.View.extend({
        template: _.template(text),
        className: 'dislike-content',
        events: {
            'click #other-dislikes': 'handleClickOnOtherDislikes',
        },
        initialize: function(attrs){
        	var self  = this;
        	this.model.on('change:bIsDisliked',function(){
        		self.doUpdateDislike();
        	});
        },
        doUpdateDislike: function(){
        	this.render().inject();
        },
        handleClickOnOtherDislikes: function() {
            new DislikeListView({
                model: new DislikeListModel({
                    iItemId: this.model.getId(),
                    sItemType: this.model.getType(),
                    sParentId: this.model.getParentModuleId()
                })
            }).render().inject();
        },

        render: function() {

            var phrase0 = 'သင္' 
              , phrase1 = ''
              , phrase2 = ''
              , iTotalDislike = this.model.getDislikeCount()
              , iRemainDislike = iTotalDislike -1
              , dislikes = this.model.dislikes
              ;
              
            if(true == this.model.isDisliked()) {
                phrase1 = '';
                phrase0 = 'သင္';
                if(iTotalDislike > 1) {
                	phrase0 = 'သင္ႏွင့္ ';
                    phrase1 = '';
                    phrase2 = (iRemainDislike > 1) ? (iRemainDislike + ' ေယာက္'): (iRemainDislike + ' ေယာက္') ;	
                }

            } else {
            	// console.log(iTotalDislike, aDislikes);
                if(iTotalDislike > 0 && dislikes.length) {

                    phrase1 = '<a href="#user/' + dislikes.at(0).get('iUserId') + '" >' + dislikes.at(0).get('sDisplayName') + '</a>';

                    if(iTotalDislike > 1) {
						
                        phrase2 = iTotalDislike - 1;
                        if(iTotalDislike - 1 > 1) {
                            phrase2 += ' ေယာက္';
                        } else {
                            phrase2 += ' ေယာက္';
                        }
                    }
                } 
            }
            
            if(iTotalDislike > 1 && !this.model.isDisliked()){
            	phrase0 =  'သင္ႏွင့္ ';
            }
            
            if(iTotalDislike < 1){
            	this.$el.addClass('hide');
            }else{
            	this.$el.removeClass('hide');
            }
            
            this.$el.html(this.template({
            	isDisliked: this.model.isDisliked(),
            	phrase0: phrase0,
                phrase1: phrase1,
                phrase2: phrase2,
                hasAnd: phrase1 != '' && phrase2 != ''
            }));
            
            if(!this.model.isDisliked()){
            	this.$el.find('.you-dislike').addClass('hide');
            }

            return this;
        }
    });
});

