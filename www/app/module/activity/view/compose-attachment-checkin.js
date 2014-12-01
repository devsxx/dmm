define([
	'text!activity/tpl/compose-attachment-checkin.html',
    'activity/model/checkinLocation',
    'activity/view/checkin-location-item',
    'text!activity/tpl/attachment-checkin-to-add.html',
    'core'
],function (){

    var core = require('core')
      , text = require('text!activity/tpl/compose-attachment-checkin.html')
      , CheckinLocationModel = require('activity/model/checkinLocation')
      , CheckinItemView = require('activity/view/checkin-location-item')
      , attachmentTpl = require('text!activity/tpl/attachment-checkin-to-add.html')
	
	return Backbone.View.extend({
        initialize: function () {
        },
        events: {
            'click #checkin_back_btn': 'handleBack',
            'click #checkinlistviewitem .checkin-item': 'handleSelectALocation',
        },
		region: {
			main: '#main-bottom',
			content: '#content-bottom'
		},
		template : _.template(text),
		render : function(context) {
			
            var self = this;
			this.$el.html(this.template(context));
			

            

            //initilize auto trigger check in search on typing
            this.autoTrigger($('#search_keyword', this.$el), function() {
                self.checkin();
            });

            // initilize jquery variable of view here
            this.$scroller = $('#checkinlistviewitem_id', this.$el);
            this.$notFound = $('#location_not_found', this.$el);
            this.$loading = $('#location_loading', this.$el);
			this.$mapHolder  =  this.$el.find('#location_map');
			
			var coords  = {latitude: 0, longitude: 0};
			
			var coords_str = localStorage.getItem('checkin_coords');
			
			if(coords_str){
				var old_coords  = JSON.parse(coords_str);
				coords = $.extend(coords, old_coords);
			} 
			
            var url = "http://maps.googleapis.com/maps/api/staticmap?center=" + coords.latitude + "," + coords.longitude + "&zoom=15&size=" + screen.width + "x137" + "&maptype=roadmap&markers=color:red%7C" + coords.latitude + "," + coords.longitude + "&sensor=false";
            this.$mapHolder.html('<img src="' + url + '" height="137" />');
           	
           	this.fetchLocation();
			
			return this;
			
		},
		
		fetchLocation: function(){
			var self = this;
			navigator.geolocation.getCurrentPosition(function(position) {

                self.currentLong = position.coords.longitude;
                self.currentLat = position.coords.latitude;
                
                localStorage.setItem('checkin_coords', JSON.stringify({latitude: self.currentLat, longitude: self.longitude}));
                
                // Add map
                var url = "http://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=15&size=" + screen.width + "x137" + "&maptype=roadmap&markers=color:red%7C" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false";
                self.$mapHolder.html('<img src="' + url + '" height="137" />');

                self.checkin();
            
            }, function(err) {
                utils.modal.alert(err.message || _t('Device cannot get your current position!'));
                self.close();
            },{
                enableHighAccuracy: false,
                // timeout: 120000,
                // maximumAge: 10000
            });
		},
		
        handleBack: function() {
            // we will refactor this evil action later

            this.close();
        },
		inject: function(){
			var main = $(this.region.main);
            var self = this;
			
			main.html(this.el);
			
			this.content = $(this.region.content);
			
            this.content.vscroll();
            this.content.on('loadmore:load', function() {
                self.checkin(true);
            });
            

			return this;
		},

        loadMore: function() {

        },

        checkin: function(isLoadmore) {
            if(typeof this.currentLong === 'undefined') {
                utils.modal.alert("Device cannot get your current position!");
                return false;
            }

            if(this.nextPageToken == '' && isLoadmore) {
                utils.modal.toast('No more result');
                this.content.trigger('loadmore:end');
                return ;
            }
            
            // Prepare searching data
            var search_keyword = $('#search_keyword').val()
              , search_radius = 2000
              , isLoadmore = typeof isLoadmore !== 'undefined' ? isLoadmore : false
              , url

            this.searchRadius = search_radius;
            this.searchKeyword = search_keyword;

            isLoadmore || $('#checkinlistviewitem', this.$el).empty();

            url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + constants.GOOGLE_API_KEY + '&sensor=true' + '&location=' + this.currentLat + ',' + this.currentLong + '&keyword=' + search_keyword + '&radius=' + search_radius;

            if(isLoadmore && typeof this.nextPageToken !== 'undefined') { // defensive programming
                url = url + '&pagetoken=' + this.nextPageToken ;
            }

            
            var data = {
            },
                settings = {
                'context': this, 
                'beforeSend': this.beforeSend
            };


            $.ajax({
                url: encodeURI(url),
                context: this,
                beforeSend: this.beforeSend,
                type: "GET", 
                cache: false,
				timeout: 40e3,
                data: data
            }).done(this.postDone).always(this.postComplete).fail(this.handleFail);

        },

        handleFail: function() {
            utils.modal.alert('Cannot get data from server.');
        },

        /**
         * post complete will always be called when the ajax finishes, it is the best place to collect your garbage
         */
        postComplete: function() {
            this.content.trigger('loadmore:end');
            this.$loading.addClass('hide');
        },

        /**
         * beforesend will be called right before data is send, this is the best place to initialize your awesome handling functions
         */
        beforeSend: function() {
            this.$notFound.addClass('hide');
            this.$loading.removeClass('hide');
            // this.$scroller.addClass('processing');
            // utils.observer.trigger('blockui');
        },

        /**
         * It is called when having a response returned.
         * Note that it will not be called if server returns status !== 200
         */
        postDone: function(data, status, jqXHR) {
            if(data.error_code > 0) {
                utils.modal.alert(data.error_message || 'Post URL failed!'); //defensive programming
                return false;
            } else {
                this.postSuccess(data);
            }
            
        },

        postSuccess: function(data) {
            if (data.results.length > 0) {
                this.$notFound.addClass('hide');
           
                for (var i = 0; i < data.results.length; i++) {
                    var checkin = new CheckinLocationModel();
                    checkin.set('id', i);
                    checkin.set('name', data.results[i].name);
                    checkin.set('icon', data.results[i].icon);
                    checkin.set('longitude', data.results[i].geometry.location.lng);
                    checkin.set('latitude', data.results[i].geometry.location.lat);
                    $('#checkinlistviewitem', this.$el).append(new CheckinItemView({model: checkin}).render().el);
                }
               
                this.nextPageToken = data.next_page_token || '';
                console.log(this.nextPageToken);

            } else {
                this.$notFound.removeClass('hide');
            }

        },

       handleSelectALocation: function(event) {
           var $target = $(event.target)
             , data = $target.data();

           var model = {
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
                //data for tempplate
                sImage: "http://maps.googleapis.com/maps/api/staticmap?center=" + data.latitude + "," + data.longitude + "&zoom=14&size=100x100" + "&maptype=roadmap&markers=color:red%7C" + data.latitude + "," + data.longitude + "&sensor=false",
                sLocation: data.name
            }
              , tpl = _.template(attachmentTpl)
              , attachmentHtml = tpl(model);


           utils.observer.trigger('attachment:success', {
                data: model, 
                html: attachmentHtml,
                type: 'checkin'
           });
           this.close();
           utils.modal.toast('Choose location successfully');

       }, 

       close: function() {
            $('body').removeClass('bottom-open');
            utils.observer.trigger('bottom:close');
       },

       handleOnKeyup: function() {

       },

       // if user stop x s, the callback will be triggered
       autoTrigger: function($el, callback, timeout) {
           //setup before functions
            var typingTimer;                //timer identifier

            var doneTypingInterval = timeout || 2000;  //time in ms, 2 second for example

            //on keyup, start the countdown
            $el.keyup(function(){
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
            });

            //on keydown, clear the countdown 
            $el.keydown(function(){
                clearTimeout(typingTimer);
            });

            //user is "finished typing," do something
            function doneTyping () {
                //do something
                callback();
            }

       }

        
	});
});
