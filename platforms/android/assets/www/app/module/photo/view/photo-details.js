define([
    'photo/view/photo-detail-item',
    'text!photo/tpl/photo-detail-page.html',
    'text!photo/tpl/photo-detail-slide.html',
    'photo/model/photo',
    'photo/view/photo-detail-action'
], function(ItemView, text, textSlide, Model, ActionView) {

    return Backbone.View.extend({
        region: {
            main: '#main',
            content: '#content',
            list: '#photo-detail'
        },
        className: 'photo-detail-popup-container',
        isFirst: true,
        template: _.template(text),
        templateSlide: _.template(textSlide),
        events: {
            "click .btn-close-photo-detail" : "closePhotoDetailPopup"
        },
        render: function(context) {

            this.context = $.extend({
                sType: null,
                iInDetails: 1,
                serviceUrl: null,
                iAmountOfPhoto: 100,
                iItemId: null,
                sModule: null
            }, context);

            this.isFirst = true;

            this.renderLimit = 20;

            this.$el.html(this.template(this.context));

            return this;

        },
        inject: function() {
            var self = this;
       
            $(this.region.main).append(this.el); // append() here coz we don't want to remove existing newsfeed stream while viewing image << Nay

            this.$content = this.$el.find(this.region.content);

            this.$list = this.$el.find(this.region.list);



            this.fetchData();
        },
        fetchData: function() {

            var postData = this.getQuery();
            var settings = {
                context: this
            };

            utils.api.get(this.context.serviceUrl, postData, settings).done(function(data) {

                if (data.error_code && data.error_code > 0) {
                    utils.modal.alert(data.error_message || _t('Can not load data from server'));
                    return utils.history.back();
                }


                this.items = data.map(function(item) {
                    return new Model(item);
                });

                this.addItems();

            }).fail(function(err) {

                utils.debug.error(err);
                return utils.history.back();
            });
        },
        getQuery: function() {

            this.context.serviceUrl = 'photo/fullphotoslide';

            var query = {
                iCurrentPhotoId: this.context.iPhotoId,
                iAmountOfPhoto: this.context.iAmountOfPhoto,
                iInDetails: this.context.iInDetails
            };

            if (this.context.sModule && this.context.sModule != 'photo') {
                query.iItemId = this.context.iItemId;
                query.sModule = this.context.sModule;
            } else if (this.context.iParentId != 0) {
                switch (this.context.sType) {
                    case 'photo':
                    case 'advancedphoto':
                        this.context.serviceUrl = 'photo/fullalbumslide';
                        query.iAlbumId = this.context.iParentId;
                        break;
                    case 'event_photo':
                    case 'fevent_photo':
                        this.context.serviceUrl = 'event/listphotos';
                        query.iEventId = this.context.iParentId;
                        break;
                    case 'profile_photo':
                        query.iUserId = this.context.iParentId;
                        break;
                    case 'user':
                        this.context.serviceUrl = 'photo/onephotoslide';
                        query.iAmountOfPhoto = 1;
                        query.iUserId = this.context.iParentId;
                        query.sAction = 'current';
                        break;
                    default:
                        break;
                }
            }

            return query;
        },
        addItems: function() {
            
            this.$list.removeClass('photo-loading');

           

            for (var i = 0; i < this.items.length; i++) {
                this.$list.append(this.templateSlide());
            }



            var initIndex = this.getIndex(this.items, this.context.iPhotoId);

            var self = this;

            this.oSwiper = new Swiper('#content', {
                noSwiping: true, // So swiping can be disabled with a class,
                initialSlide: initIndex,
                onSlideChangeEnd: function(swiper) {
                    self.onSlideChangeEnd(self);
                }
            });

            this.updateSlides();
            this.enableZoom();
        },
        getIndex: function(items, id) {

            for (var i = 0; i < items.length; i++) {
                if (items[i].getId() == id) {
                    return i;
                }
            }

            return 0;
        },
        updateSlides: function() {

            var activeIndex = this.oSwiper.activeIndex;

            this.firstIndex = Math.max(0, activeIndex - (this.renderLimit / 2 - 1));
            this.lastIndex = Math.min(this.items.length - 1, activeIndex + (this.renderLimit / 2));

            if (this.firstIndex > 0) {
                this.emptySlides(0, this.firstIndex - 1);
            }

            this.fillSlides(this.firstIndex, this.lastIndex);
           
            if (this.lastIndex < this.oSwiper.slides.length - 1) {
                this.emptySlides(this.lastIndex + 1, this.oSwiper.slides.length - 1);
            }


        },
        emptySlides: function(from, to) {

            for (var i = from; i <= to; i++) {
                this.$list.children().eq(i).empty();
            }
        },
        fillSlides: function(from, to) {
            
            for (var i = from; i <= to; i++) {
                var $slide = this.$list.children().eq(i);

                if (!$slide.html()) {
                  
                    $slide.html(new ItemView({
                        model: this.items[i]
                    }).render().el);
                }
            }

        },
        enableZoom: function() {

            var activeSlide = this.oSwiper.activeSlide();
                activeSlide = $(".photo-detail-paged").find(".swiper-slide"); //patched << Nay

            // update activity extra block
            var activeItem = $(activeSlide).find('.content-slide');
            activeItem.trigger('active');

            var inScroll = $(activeSlide).find('.photo_display').get(0);
            this.oZoom = new iScroll(inScroll, {
                hideScrollbar: true,
                hScrollbar: false,
                vScrollbar: false,
                zoom: true,
                // topOffset: 100,
                // So Swiper will not swipe/slide when zooming is enabled
                onZoomEnd: function(e) {
                    var slide = $(this.wrapper);

                    if (parseInt(this.scale) == 1) {
                        slide.removeClass('swiper-no-swiping');
                    } else {
                        slide.addClass('swiper-no-swiping');
                    }
                },
                // Since the images are inside of the swiper slide it
                // got a huge left offset, but the offset isn't really
                // part of the page/image since the page is completely
                // shown within the viewable area of the viewport. So
                // simply remove the wrapperOffsetLeft from the
                // calculation and be happy.
                //
                // touchstart: When pinch-zooming
                // touchend: When double-tap zooming
                onZoomStart: function(e) {
                    if (e.type === 'touchstart') {
                        this.originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX) / 2 - this.x;
                    } else if (e.type === 'touchend') {
                        this.wrapperOffsetLeft = 0;
                    }
                }
            });
        },
        onSlideChangeEnd: function(self) {

            var activeIndex = self.oSwiper.activeIndex;
            var prevSlide = self.$list.children().eq(Math.max(0, activeIndex - 1));
            var nextSlide = self.$list.children().eq(Math.min(self.oSwiper.slides.length - 1, activeIndex + 1));

            if ((activeIndex > 0 && !prevSlide.html()) || (activeIndex < self.oSwiper.slides.length - 1 && !nextSlide.html())) {
                self.updateSlides();
            }

            if (activeIndex == 0 && !self.fetchingPrevItems && !self.addingPrevItems) {
                self.fetchPrevItems();
            }

            if (activeIndex == self.oSwiper.slides.length - 1 && !self.fetchingNextItems && !self.addingNextItems) {
                self.fetchNextItems();
            }

            this.enableZoom();
        },
        fetchPrevItems: function(swiper) {

            this.fetchingPrevItems = true;

            var postData = $.extend(this.getQuery(), {
                iCurrentPhotoId: this.items[0].getId(),
                sAction: 'previous'
            });
            var settings = {
                context: this
            };

            utils.api.get(this.context.serviceUrl, postData, settings).done(function(data) {

                if (data.error_code && data.error_code > 0) {
                    utils.modal.alert(data.error_message || _t('Can not load data from server'));
                    return utils.history.back();
                }

                var newitems = data.map(function(item) {
                    return new Model(item);
                });

                this.items = newitems.concat(this.items);

                if (newitems.length > 0) {
                    this.addPrevItems(newitems);
                }

            }).fail(function(err) {

                utils.debug.error(err);
                utils.modal.alert(_t('Can not load data from server'));

            }).always(function() {

                var self = this;

                setTimeout(function() {
                    self.fetchingPrevItems = false;
                }, 500);

            });
        },
        addPrevItems: function(newitems) {

            this.$list.addClass('swiper-no-swiping'); // prevent swipe action during adding slides

            this.addingPrevItems = true;

            var activeIndex = this.oSwiper.activeIndex + newitems.length;

            for (var i = 0; i < newitems.length; i++) {
                var newSlide = document.createElement('div');
                newSlide.className = 'swiper-slide';

                this.oSwiper.prependSlide(newSlide);
            }

            this.oSwiper.swipeTo(activeIndex, 0);

            var self = this;

            setTimeout(function() {
                self.updateSlides();
                self.addingPrevItems = false;
                self.$list.removeClass('swiper-no-swiping');
            }, 500);
        },
        fetchNextItems: function() {

            this.fetchingNextItems = true;

            var postData = $.extend(this.getQuery(), {
                iCurrentPhotoId: this.items[this.items.length - 1].getId(),
                sAction: 'next'
            });
            var settings = {
                context: this
            };

            utils.api.get(this.context.serviceUrl, postData, settings).done(function(data) {

                if (data.error_code && data.error_code > 0) {
                    utils.modal.alert(data.error_message || _t('Can not load data from server'));
                    return utils.history.back();
                }

                var newitems = data.map(function(item) {
                    return new Model(item);
                });

                this.items = this.items.concat(newitems);

                if (newitems.length > 0) {
                    this.addNextItems(newitems);
                }

            }).fail(function(err) {

                utils.debug.error(err);
                utils.modal.alert(_t('Can not load data from server'));

            }).always(function() {

                this.fetchingNextItems = false;

            });
        },
        addNextItems: function(newitems) {
            alert("...");
            this.addingNextItems = true;

            for (var i = 0; i < newitems.length; i++) {
                var newSlide = document.createElement('div');
                newSlide.className = 'swiper-slide';
                

                this.oSwiper.appendSlide(newSlide);
            }

            this.updateSlides();

            this.addingNextItems = false;
        },
        closePhotoDetailPopup: function (){
     
            utils.router.previous();
            $("."+this.className).remove();

        }
    });
});