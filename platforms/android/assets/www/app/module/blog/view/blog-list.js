define([
    'blog/model/blog',
    'blog/view/blog-item',
    'text!blog/tpl/blog-list.html',
], function (Model, ItemView, text) {

    return Backbone.ListView.extend({
        defaults: {
            iPage: 1,
            iAmountOfBlog: 10,
            sSearch: ""
        },
        followById: false,
        api: 'blog/fetch',
        phraseNotFound: _t('ဘေလာ့မရွိေသးပါ။'),
        phraseNotMore: _t('ေနာက္ထပ္ဘေလာ့မရွိပါ။'),
        className: 'blog-list',
        template: _.template(text),
        itemModel: Model,
        itemView: ItemView
    });
});