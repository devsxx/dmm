define([
    'forum/model/forum',
    'forum/view/forum-item',
    'text!forum/tpl/forum-list.html',
], function(Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {},
        followById: false,
        api: 'forum/fetch',
        phraseNotFound: 'No forums found.',
        phraseNotMore: 'No more forums.',
        className: 'forum-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});