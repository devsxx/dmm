define([
    'photo/model/photo',
    'photo/view/photo-item',
    'text!photo/tpl/photo-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            // sItemType: null,
            //iUserId: null,
            iInDetails: 1,
            sOrder: "latest",
            iAmountOfPhoto: 12 // 4 rows, 3 photos per rows
        },
        followById: false,
        api: 'photo/filter',
        phraseNotFound: 'ဓာတ္ပံု မရွိပါ။',
        phraseNotMore: 'ဓာတ္ပံု မရွိပါ။',
        className: 'clearfix photo-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView,
        parseData: function(data, ItemModel) {
            var self = this;
            return data.map(function(item) {
                if (self.settings.iAlbumId != void 0) {
                    item.iAlbumId = parseInt(self.settings.iAlbumId, 10);
                }
                if (self.settings.iParentId != void 0) {
                    item.iParentId = parseInt(self.settings.iParentId, 10);
                }
                if (self.settings.sParentType != void 0) {
                    item.sParentType = self.settings.sParentType;
                }
                return new ItemModel(item);
            });
        }
    });
});