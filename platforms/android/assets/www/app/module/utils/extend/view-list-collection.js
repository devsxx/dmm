define([
	'utils/extend/view-list',
],function(){
	Backbone.ListViewCollection = Backbone.ListView.extend({
        Collection: null,
        collection: null,
        init: function() {
            if(this.settings.collection) {
                this.collection = this.settings.collection;
            } else {
                this.collection = new this.Collection();
            }

            // this.collection.stopListening(['add', 'all', 'reset']);
            // this.collection.off(['add', 'all', 'reset']);
            this.collection.off();
            this.collection.on('add', this.attachNewItem, this);
            this.collection.on('all', this.onCollectionChange, this);
            this.collection.on('reset', this.handleCollectionReset, this);
        },
        onCollectionChange: function() {
            this.updateQuery();
        },

        handleCollectionReset: function() {
            this.rerenderView();
        },

        updateQuery: function() {
			if(this.collection.length && this.followById){
                this.query.iMaxId = this.collection.last().getId();
				
			}else{
				this.query.iPage  =  (this.query.iPage || 0 ) + 1;
			}
        },

		handleInjectItem: function(item, callback){
			new this.itemView({model: item}).render().inject(callback);
		},

        attachNewItem: function(newItem) {
            if(this.collection.length == 1) { // remove notices
                this.$el.html('');
            }
            var view
              , prev
              , index

            view = new this.itemView({ model: newItem }).render().el;

            if(newItem.isNew()) {
                this.$el.append(view);
                // this.el.scrollTop = this.el.scrollHeight;
            } else {

                index = this.collection.indexOf(newItem);

                prev = this.collection.at(index - 1);

                if (prev) {
                    $prev = $('#' + prev.getDataId());
                    $prev.after(view);
                } else {
                    this.$el.prepend(view);
                }

            }

            if(newItem.isNeedScroll()) {
                this.$el.parents('.content').scrollTop(9999999);
            }

            this.$scroller.trigger('refresh')
			// this.$scroller.trigger('loadmore:end');

            return this;

        },

        parseData: function(data) {
            return data;
        },

		loadMoreSuccess: function(data){
            var data = this.parseData(data);
            if(this.isFirst) {
                this.collection.reset(data);
                this.trigger('view:load-complete');
            } else {
                this.collection.add(data);
            }

            this.$scroller.trigger('loadnew:unlock');
			this.$scroller.trigger('loadmore:end');
		},

        rerenderView: function() {
            if(this.collection.length == 0) {
                this.$el.html(utils.helper.notfound(_t(this.phraseNotFound)));
            } else {
                this.$el.html('');
            }

            _.each(this.collection.models, function(item) {
                this.attachNewItem(item);
            }, this);

            this.trigger('view:rerender');

            return this;
        },

	});
});

