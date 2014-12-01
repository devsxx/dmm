define([
    'utils/extend/view-polyplatform',
    'utils/plugin/api',
], function(View, api) {
    Backbone.ListView = Backbone.PolyplatformView.extend({
        defaults: {}, // default data to query
        api: '',
        apiFn: api.get,
        phraseNotFound: 'No item found',
        phraseNotMore: 'No item more',
        template: null,
        itemView: null,
        followById: false, // load data by iMinId, iMaxId  or iPage number
        itemModel: null,
        query: {},
        settings: {},
        initialize: function(attrs, $holder, $scroller, settings) { // should not be overrider

            $.extend(this, attrs);

            this.$scroller = $scroller;
            this.$holder = $holder;

            this.settings = $.extend({
                loadnew: false,
                loadmore: true,
            }, settings);

            var self = this;

            if (this.settings.loadnew) {
                this.$scroller.on('loadnew:load', function() {
                    self.loadNew();
                });
            }

            if (this.settings.loadmore) {
                this.$scroller.on('loadmore:load', function() {
                    self.loadMore();
                });
            }

            this.$ajaxMore = this.$ajaxNew = false;

            this.init.apply(this, arguments);
        },

        init: function() {}, // override 
        className: 'item-list',

        render: function(query) {

            this.query = $.extend({}, this.defaults, query);

            this.$el.html(this.template());

            this.isFirst = true;

            return this;
        },
        inject: function() {

            this.$holder.html(this.$el);

            this.loadMore();

            this.isFirst = true;

            return this;
        },
        parseData: function(data, ItemModel) {
            return data.map(function(item) {
                return new ItemModel(item);
            });
        },
        loadNew: function() {
            var sendData = this.query;
            
            if (this.followById) {
                sendData.sAction = 'new';
            }

            this.$ajaxMore = this.apiFn(this.api, sendData, {
                context: this
            }).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    return this.loadNewFail(data);
                }
                this.loadNewSuccess(data);

            }).fail(function(e,s){
                       if(this.api =="feed/fetch"){ // news feed only available for cache currently
                        this.loadNewSuccess([]); // we don't want this to mess up cache << Nay 
                       }else{
                        this.loadNewFail(e,s);
                       }

                    
            });
        },
        loadMore: function() {

            var sendData = this.query;
            if (this.followById) {
                // if (sendData.iMaxId == 1) {
                // this.loadMoreSuccess([]);
                // return;
                // }
                sendData.sAction = 'more';
            }

            this.$ajaxMore = this.apiFn(this.api, sendData, {
                context: this
            }).done(function(data) {
                if (data.error_code && data.error_code > 0) {
                    this.loadMoreFail(data);
                } else {
                    this.loadMoreSuccess(data);
                    if(this.api=="feed/fetch" ){
                         localStorage.setItem("newsfeed", JSON.stringify(data)); // << Nay 
                     }                   
                }

            }).fail(function(e,s){
                   var cache_feeds = localStorage.getItem("newsfeed");
                       data = JSON.parse(cache_feeds);
                       if(this.api =="feed/fetch" && this.isFirst){
                          if(data){
                             this.loadMoreSuccess(data);
                           }else{
                            this.loadMoreFail(e,s);
                           }
                       }else if (this.api == "feed/fetch" && !this.isFirst){
                            this.loadMoreSuccess([]); 
                       }else{
                         this.loadMoreFail(e,s);
                       }

                    
            });
        },
        resetQuery: function(query) {

            this.$ajaxMore && this.$ajaxMore.abort(); // stop old more loading, prevent slow connection

            this.$ajaxNew && this.$ajaxNew.abort();

            this.query = $.extend({}, this.defaults, query);
            this.$el.html(this.template(this.query));
            this.isFirst = true;
            this.loadMore();
        },
        loadMoreFail: function(data, status) {

            if (status == 'abort') {
                return;
            }

            utils.debug.error('loadmore:fail');
            this.$scroller.trigger('loadmore:unlock').trigger('loadmore:end');
            utils.modal.toast(data.error_message || _t('Can not load data from server'));

            this.$el.empty();
        },
        loadNewFail: function(data, status) {

            if (status == 'abort') {
                return;
            }

            utils.debug.error('loadnew:fail');
            this.$scroller.trigger('loadnew:end');
            utils.modal.toast(data.error_message || _t('Can not load data from server'));

            this.$el.empty();
        },
        handleInjectItem: function(item, callback) {
            new this.itemView({
                model: item
            }).render(this.query).inject(callback);
        },
        loadNewSuccess: function(data) {

            var items = this.parseData(data, this.itemModel);
            var length = items.length;
            var $ele = this.$el;
            var that = this;

            var handleInjectDom = function(dom) {
                $ele.prepend(dom);
            }

            _.each(items, function(item) {
                that.handleInjectItem(item, handleInjectDom);
            });

            if (length && this.followById) {
                var id1 = items[length - 1].getId();
                var id2 = items[0].getId();

                this.query.iMinId = Math.max(id1, id2, this.query.iMinId);
                this.query.iMaxId = this.query.iMaxId > 0 ? Math.min(id1, id2, this.query.iMaxId) : Math.min(id1, id2);
            } else {
                this.query.iMinPage = (this.query.iMinPage || 0) - 1;
            }

            // console.log('loaded min id with ', this.query);

            this.$scroller
                .trigger('refresh')
                .trigger('query:changed', this.query);

            this.$scroller
                .trigger('loadnew:end');
        },
        loadMoreSuccess: function(data) {
            var items = this.parseData(data, this.itemModel);
            var length = items.length;
            var $ele = this.$el;
            var that = this;

            if (this.isFirst) {
                if (!length) {
                    // tell the viewer there is no videos then disable load-more, load-less.
                    $ele.html(utils.helper.notfound(_t(this.phraseNotFound)));
                } else {
                    $ele.html('');
                }
            }

            this.isFirst = false;

            var handleInjectDom = function(dom) {
                $ele.append(dom).trigger('injected');
            }

            _.each(items, function(item) {
                that.handleInjectItem(item, handleInjectDom);
            });


            if (length && this.followById) {
                var id1 = items[length - 1].getId();
                var id2 = items[0].getId();

                this.query.iMinId = Math.max(id1, id2, this.query.iMinId);
                this.query.iMaxId = this.query.iMaxId > 0 ? Math.min(id1, id2, this.query.iMaxId) : Math.min(id1, id2);

            } else {
                this.query.iPage = (this.query.iPage || 0) + 1;
            }


            if (!length) {
                // this.$scroller.trigger('loadmore:lock'); // lock or unlock
                if (!this.isFirst) {
                    if (this.settings.loadmore) {
                        this.$scroller.trigger('loadmore:lock'); // lock or unlock	
                    }
                    utils.modal.toast(_t(this.phraseNotMore));
                }
            } else {

                if (this.settings.loadmore) {
                    this.$scroller.trigger('loadmore:unlock'); // lock or unlock
                }
                if (this.settings.loadnew && this.followById) {
                    this.$scroller.trigger('loadnew:unlock');
                }
			//HNINN UPDATE
			if(this.api=='feed/fetch'){
			utils.api.get('feed/forad',{
			  
			})
			  .done(function(data) { 
				if (data.hasOwnProperty('error_code') && data.error_code) {
				  utils.modal.alert(data.error_message);
				  return;
				}         
				var pageDataTitle = data.sTitle;
				var pageDatasAvatarImage = data.sAvatarImage;
				var pageurl = '#' + data.sType+ '/' +data.iPageId;
				var pagesAvatarImage = data.sAvatarImage;
				var pagesText = data.sText;
				var html='<div style="width:100%; background-color: #ffffff; margin: 5px 0px; border: 1px solid #CCC;  float: left;" rel="link" data-url="'+pageurl+'">\r\n <div style="color: #009fda;   overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">\r\n <span style="padding: 5px;">'+pageDataTitle+'</span>\r\n </div>\r\n<div class="item-content">\r\n<a style="width: 50px;height: 50px;" href="'+pageurl+'">\r\n<img style="width: 100%; height: auto; margin-bottom: 5px;" src="'+pagesAvatarImage+'" />\r\n</a></div>\r\n\r\n<div style="padding: 0 8px 8px 8px;font-size: 0.9em;word-break: break-all;">\r\n<span>'+pagesText.substr(0,1000)+'</span>\r\n</div>\r\n </div>';
				  
				$ele.append(html);
				
			  });   
			
			}       
        //END

        }

            this.$scroller
                .trigger('refresh')
                .trigger('query:changed', this.query);

            this.$scroller.trigger('loadmore:end');
        },
        destroy: function() {

            this.$scroller.off('loadnew:load loadmore:load');
        }
    });
});