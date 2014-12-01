define(function(core) {
    return Backbone.Model.extend({
        idAttribute : 'id',
        defaults : {
            'sModelType' : 'user'
        },
        getId: function () {
            return this.get('iUserId');
        },
        getName : function() {
            return this.get('sFullName');
        },
        getTitle : function() {
            return this.get('sFullName');
        },
        getUrl: function(){
            return '#user/' + this.getId();
        },
        getLink: function(){
            return '<a href="'+this.getUrl()+'">'+ this.getTitle() +'</a>';
        },
        getImgSrc : function() {
            return this.get('sImageUrl') || '';
        },
        getPercentage : function() {
            return this.get('iSuccessPercentage') || 0;
        },
        getQuizId: function (){
            return this.get('iQuizId') || 2418;
        }
    });
});
