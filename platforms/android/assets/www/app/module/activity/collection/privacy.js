define(['activity/model/privacy'],function(model){

	var Collection = Backbone.Collection.extend({
		model: model,
        setChosen: function(id) {
            _.each(this.models, function(item) {
                if(item.id == id) {
                    item.set('isChosen', true);
                } else {
                    item.set('isChosen', false);
                }

            }, this);

            this.trigger('privacy-chosen');
        },

        getChosen: function() {
            var chosen = this.findWhere({
                isChosen: true
            });

            if(!chosen) {
                return new model({
                    'sValue': 0,
                    'sPhrase': 'everyone'
                });
            }

            return chosen;
        }
	});



	return Collection;
});
