define(function(){
    Backbone.PolyplatformView = Backbone.View.extend({
    });

    Backbone.PolyplatformView.extend = function() {
        if(arguments[0].moduleId) {
            var extendPropsPath = arguments[0].moduleId.replace('/', '/' + constants.template + '/');

            if(require.defined(extendPropsPath)) {
                _.extend(arguments[0], require(extendPropsPath));
            }
            console.log('enhanced', arguments[0]);
        } else {
            console.log('No module Id in polyplatform view -> cannot extend its parent');
        }
        var extended = Backbone.View.extend.apply(this, arguments);

        return extended;
    }

});
