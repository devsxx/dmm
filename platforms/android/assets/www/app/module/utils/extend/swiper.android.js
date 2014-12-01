define([
	'swiper',
	'utils/plugin/debug',
	'utils/plugin/support'
],function(swiper, debug, support){
	
	function ensurePullToLoadWithNativeScroller($ele) {
		var
			$wrapper 			= $ele.find('.swiper-wrapper'),
			ptr_height			= 15,
			release_height		= 30,
			height				= 0,
			container_height 	= $ele.height(),
			loadnew_barrier  	= 0,
			loadmore_barrier 	= 0,
			loadnew_state 		= 0,
			loadmore_state 		= 0,
			$slider    			= $ele.find('.swiper-slide').first(),
			$new 				= $ele.find('.loadnew-indicator').first(),
			$more 				= $ele.find('.loadmore-indicator').first(),
			has_new 			= $new.length,
			has_more			= $more.length,
			t_release_to_update = _t('Release to update'),
			t_pulldown_to_update= _t('Pull down to update'),
			t_loading           = _t('Loading'),
			t_updating			= _t('ခဏေစာင့္ပါ။'),
			t_release_to_loadmore = _t('Release to load more'),
			t_pullup_to_loadmore  = _t('Pull up to load more')
		;
			
		if(!$slider.data('url')) // issue with comment
			// fix issue always scrollable
			$slider.css({minHeight: container_height+ 1 });
			
		$wrapper.on('touchstart', function (ev) {
			if ($ele.scrollTop() === 0) { // fix scrolling
				$ele.scrollTop(1);
			}
			
			
			check_height = $wrapper.height() - container_height;
			
			// reset state
			loadnew_state = $ele.data('loadnew_state') || false;
			loadmore_state = $ele.data('loadmore_state') || false;
			loadnew_barrier  =  loadmore_barrier = 0; // reset status at start moving.

		}).on('touchmove', function (ev) {
			
			
			
			var top = $ele.scrollTop();
			
			// process loading new case.
			if (!loadnew_state) 
			{
				if(-top > release_height ){ // release to update
					
					if( 3 != loadnew_barrier){  // prevent duplicate check
						loadnew_barrier = 3;
						utils.debug.log('release to update');
						if(has_new){
							$new.removeClass('invisible').find('span').text(t_release_to_update);
							$new.addClass('flip');
						}
					}
				}else 
				if (-top > ptr_height ) { // pull down to update 
					if(2 != loadnew_barrier){ // prevent duplicate check
						loadnew_barrier =  2;
						utils.debug.log('pull down to update');
						if(has_new){
							$new.removeClass('invisible').removeClass('flip').removeClass('loading');
							$new.find('span').text(t_pulldown_to_update);
						}
					}
				}else 
				if(-top > 0){
					if(1 != loadnew_barrier){
						loadnew_barrier =  1;
						// utils.debug.log('hide pull down to update');
						if(has_new){
							$new.addClass('invisible');
							$new.find('span').text('');
						}
					}
				}
			}
			
			
		}).on('touchend', function(ev) {
			
			console.log('touch end');
			
			console.log(document.body.offsetHeight - window.pageYOffset - window.innerHeight);
			if (loadnew_barrier == 3) { // loading state
				console.debug('nativer scroll fire loadnew:load');
				$ele.data('loadnew_state',true).trigger('loadnew:load');
				if(has_new){
					$new.removeClass('flip').addClass('loading');
					$new.find('span').text(t_loading);
				}
			}
			// console.log(document.body.offsetHeight - window.pageYOffset - window.innerHeight);
// 			
			// if(!loadmore_state){
				// if(( document.body.offsetHeight - window.pageYOffset - window.innerHeight) < 10){
					// loadmore_barrier = 3;
				// }
			// }
// 			
			// if (loadmore_barrier == 3) { // loading state
				// utils.debug.log('nativer scroll fire loadmore:load');
				// $ele.data('loadmore_state',true).trigger('loadmore:load');
				// if(has_more){
					// $more.removeClass('flip').addClass('loading');
					// $more.find('span').text(t_loading);
				// }
			// }
		}).on('touchleave',function(){
			console.log('touch leave');
		}).on('touchcancel',function(){
			console.log('touch cancel');
		}).on('touchenter',function(){
			console.log('touch enter');
		});
		
		if(has_new){
			// $(document.body).scrollTop(100);
		}
		
		var lastScrollYOffset  = 0;
		var newScrollYOffset = 0;
		var loadNewHeight = 0;
		
		$(document).on('scroll',function(){
			
			loadmore_state = $ele.data('loadmore_state') || false;
			loadnew_state = $ele.data('loadnew_state') || false;
			newScrollYOffset  = window.pageYOffset;
			
			lastScrollYOffset =  window.pageYOffset;
			
			if(!loadnew_state){
				
			}
			
			if(!loadmore_state){
				if(document.body.offsetHeight - window.pageYOffset - window.innerHeight < 10){
					$ele.trigger('loadmore:start').trigger('loadmore:load');
					$ele.data('loadmore_state',true);
					if(has_more){
						$more.removeClass('hide').removeClass('invisible');
					}
				}
			}
		});
	};
	
	function buildIndicator($ele){
		
		$new 				= $ele.find('.loadnew-indicator').first(),
		$more 				= $ele.find('.loadmore-indicator').first(),
		has_new 			= $new.length,
		has_more			= $more.length,
		
		 $ele
		 .on('loadnew:end',function(){
		 	utils.debug.log('loadnew:end');
		 	if('lock'!= ($ele.data('loadnew_state') || false)){$ele.data('loadnew_state',false);}
		 	if(has_new){
		 		$new.addClass('invisible');
		 		$ele.scrollTop(30);
		 	}
		 })
		 .on('loadnew:lock',function(){
		 	utils.debug.log('loadnew:lock');
		 	$ele.data('loadnew_state', 'lock');
		 })
		 .on('loadnew:unlock',function(){
		 	utils.debug.log('loadnew:unlock');
		 	$ele.data('loadnew_state', false);
		 })
		 .on('loadmore:end',function(){
		 	utils.debug.log('loadmore:end');
		 	if('lock'!= ($ele.data('loadmore_state') || false)){$ele.data('loadmore_state',false);}
		 	if(has_more){
		 		$more.addClass('invisible');
		 	}
		 })
		 .on('loadmore:lock',function(){
		 	utils.debug.log('loadmore:lock');
		 	$ele.data('loadmore_state', 'lock');
		 })
		 .on('loadmore:unlock',function(){
		 	utils.debug.log('loadmore:unlock');
		 	$ele.data('loadmore_state', false);
		 });
		 
		 $ele
		 .data('loadmore_state','lock')
		 .data('loadnew_state','lock'); 
	}	
	
	function makeVertialSwiper($ele, options)
	{
		var  
			loadnew_state = 0,
			loadmore_state =  0,
			loadnew_barrier = 0,
			loadmore_barrier =0,
			ptr_height	= 15,
			release_height = 30,
			$new 				= $ele.find('.loadnew-indicator').first(),
			$more 				= $ele.find('.loadmore-indicator').first(),
			has_new 			= $new.length,
			has_more			= $more.length,
			t_release_to_update = _t('Release to update'),
			t_pulldown_to_update= _t('Pull down to update'),
			t_loading           = _t('Loading'),
			t_updating			= _t('ခဏေစာင့္ပါ။'),
			t_release_to_loadmore = _t('Release to load more'),
			t_pullup_to_loadmore  = _t('Pull up to load more')
			;
		  
		
		function onTouchStart(obj){
			// reset state
			loadnew_state = $ele.data('loadnew_state');
			loadmore_state = $ele.data('loadmore_state') || false;
			loadnew_barrier  =  loadmore_barrier = 0; // reset status at start moving.
		}
		
		function onResistanceAfter(obj,position){
			if(!loadmore_state){
				if(position > release_height){
					if(loadmore_barrier != 3){
						loadmore_barrier =  3;
						if(has_more){
							$more.removeClass('invisible').addClass('flip');
							$more.find('span').text(t_release_to_loadmore);
						}
					}
				}else if(position > ptr_height){
					if(loadmore_barrier != 2){
						loadmore_barrier = 2;
						if(has_more){
							$more.removeClass('invisible').removeClass('flip').removeClass('loading');
							$more.find('span').text(t_pullup_to_loadmore);
						}
					}
				}else{
					if(loadmore_barrier != 1){
						loadmore_barrier = 1;
						// utils.debug.log('hide pull down to update');
						if(has_new){
							$new.addClass('invisible');
							$new.find('span').text('');
						}
					}
				}
			}
		}
		
		function onResistanceBefore(obj,position){
			if(position > release_height){
				if(loadnew_barrier != 3){
					loadnew_barrier =  3;
					
					if(has_new){
						$new.find('span').text(t_release_to_update);
						$new.addClass('flip');
					}
				}
			}else if(position > ptr_height){
				if(loadnew_barrier != 2){
					loadnew_barrier = 2;
					if(has_new){
						$new.removeClass('invisible').removeClass('flip').removeClass('loading');
						$new.find('span').text(t_pulldown_to_update);
					}
				}
			}else{
				if(loadnew_barrier != 1){
					loadnew_barrier = 1;
					if(has_new){
						$new.addClass('invisible').removeClass('flip').removeClass('loading');
						$new.find('span').text(t_pulldown_to_update);
					}
				}
			}
		}
			
	 	function onTouchEnd(obj)
		{
			if(loadmore_barrier == 3){
				console.log('swiper fire "loadmore:load" #'+ $ele.attr('id'));
				$ele.trigger('loadmore:load');
				$ele.data('loadmore_state',true);
				
				if(has_more){
					$more.removeClass('flip').addClass('loading');
					$more.find('span').text(t_loading);
				}
			}
			else if(loadnew_barrier ==3)
			{
				console.log('swiper fire "loadnew:load"');
				$ele.trigger('loadnew:load');
				$ele.data('loadnew_state',true);
				
				if(has_new){
					$new.removeClass('flip').addClass('loading');
					$new.find('span').text(t_loading);
				}
			}
		}
		
		options.onTouchEnd =  onTouchEnd;
		options.onTouchStart = onTouchStart;
		options.onResistanceAfter =  onResistanceAfter;
		options.onResistanceBefore =  onResistanceBefore;
		
		var $swiper = new Swiper($ele.get(0), options);
		
		$ele.on('refresh',function(){
			var sw = $ele.data('swiper');
			if(sw && sw){
				sw.reInit();
			}
		});
		
		$ele.data('swiper', $swiper);
		
		return $swiper;
	}

    /**
     * @param {DOM} list 
     */
    function initPullDownToRefresh (list) {
       if(!list) return;
       var
			t_release_to_update = _t('Release to update'),
			t_pulldown_to_update= _t('Pull down to update'),
			t_loading           = _t('Loading'),
			t_updating			= _t('ခဏေစာင့္ပါ။'),
			t_release_to_loadmore = _t('Release to load more'),
			t_pullup_to_loadmore  = _t('Pull up to load more');

       var $list = $(list);
       var anchorId = 'loadnew-anchor-' + _.random(1, 40000);
       $list.prepend('<div id="'+ anchorId + '"> </div>');
       var $loadnewAnchor = $('#' + anchorId);

       var $new = $(list).find('.loadnew-indicator').first();
       
       //grab the loading div
       //keep the state whether the fingers are touched
       var isTouched = false;

       //keep the state whether a PULL actually went out
       var isMoved = false;
       
       //Add the start of the touching
       $list.on("mousedown touchstart",function(e){
           if(!isElementInViewport($loadnewAnchor.get(0))) {
               return;
           }
           isTouched = true;
           prevY = getYOfEvent(e);
       });


       var threshold = 30;
       var upperThreshold = 200;
       $list.on("mousemove touchmove",function(e){
           if(isTouched){
               if(getYOfEvent(e) > prevY){
                   //on touchmove, we add the exact amount fingers moved to the top of the list
                   var change = getYOfEvent(e) - prevY;                  
                   // utils.debug.log('change: ' + change);
                   isMoved = true;
                   isTouched = false;
                   loadNewData();

               }
           }

       });

       function backToOriginal() {
           $new.addClass('invisible');
           $new.find('span').text('');
           $new.addClass('hide');
           // $list.css({'-webkit-transform':'translate3d(0,' + (0) + 'px, 0)'});
           // $list.removeAttr('style');
       }

       function changeToUpdating() {
           $new.removeClass('hide').removeClass('invisible').addClass('loading');
           $new.find('span').text(t_updating);
           // $list.css({'-webkit-transform':'translate3d(0,' + threshold + 'px, 0)'});
       }

       function changeToReleaseToUpdate() {
           $new.find('span').text(t_release_to_update);
           $new.addClass('flip');
       }

       function changeToPulldownToUpdate() {
            $new.removeClass('invisible').removeClass('flip').removeClass('loading');
            $new.find('span').text(t_pulldown_to_update);
       }
       
       function getYOfEvent(e) {
           e = e.originalEvent;
           return e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
       }

       function getXOfEvent(e) {
           if(e.changedTouches[0]) {
               return e.changedTouches[0].clientX;
           } else {
               return e.clientX;
           }
       }
       

        $(list).on('loadnew:end loadmore:end', function() {
            // loader.style.display = "none";
            backToOriginal();
        });
       
        function loadNewData(){
            // alert('loadata');
            utils.debug.log('refresher fire "loadnew:load"');
            $(list).trigger('loadnew:load');
            changeToUpdating();
         
        }

        var headerHeight = 40;
        function isElementInViewport (el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.top >= headerHeight &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        }

        $new.addClass('hide');
    }


    /**
     * @param {DOM} list 
     */
    function initPullDownToRefresh2 (list) {
       if(!list) return;
       var
			t_release_to_update = _t('Release to update'),
			t_pulldown_to_update= _t('Pull down to update'),
			t_loading           = _t('Loading'),
			t_updating			= _t('ခဏေစာင့္ပါ။'),
			t_release_to_loadmore = _t('Release to load more'),
			t_pullup_to_loadmore  = _t('Pull up to load more');

       var loaderHeight = 150;

       var $list = $(list);
       $list.prepend('<div id="loadnew-anchor"> </div>');
       var $body = $('body');
       var $loadnewAnchor = $('#loadnew-anchor');

       var $new = $(list).find('.loadnew-indicator').first();
       
       //grab the loading div
       //keep the state whether the fingers are touched
       var isTouched = false;

       //keep the state whether a PULL actually went out
       var isMoved = false;

       //This has the original Top offset (relative to screen) position of the list
       var prevY = parseInt(list.offsetTop);      

       var updateRefresher;
       var threshold = 25;
       var prevChange = -100;
       var counter = 0;


       $list.on("mousedown touchstart",function(e){
           if(!isElementInViewport($loadnewAnchor.get(0))) {
               return;
           }
           //touch started ? YES
           isTouched = true;
           //initialize the touched point
           prevY = $body.scrollTop();

           window.clearInterval(updateRefresher);

           updateRefresher = setInterval(function() {
               var change = prevY - $body.scrollTop();
               utils.debug.log('change abc: ' + change);
               if(change == prevChange) {
                   if(counter >= 5) {
                       handleTouchEnd();
                       counter = 0;
                       return ;
                   } 
                   counter++;
               }
               if(change < threshold) {
                   changeToPulldownToUpdate();
                   isMoved = false;
               } else {
                   console.log('start ----- release');
                   changeToReleaseToUpdate();
                   console.log('end ----- release');
                   isMoved = true;
               }

               prevChange = change;


           }, 30);

       });

       var handleTouchEnd = function() {
           if(!isElementInViewport($loadnewAnchor.get(0))) {
               return;
           }
           // alert('end');
           //on touchup we cancel the touch event
           isTouched = false;
           window.clearInterval(updateRefresher);

           if(isMoved) {
                utils.debug.log('refresher fire "loadnew:load"');
                $(list).trigger('loadnew:load');
                changeToUpdating();
           } else {
               backToOriginal();
           }

           isMoved = false;
       }


       function initRefreshTransform() {
           $list.css({
               '-webkit-transform': 'translate3d(0px, -15px, 0px)',
               '-webkit-transition': '-webkit-transform 0ms',
               'transition': '-webkit-transform 0ms',
               // 'overflow': 'visible'
           });
       }
       function backToOriginal() {
           // alert('to original');
           // $body.scrollTop(loaderHeight);
           $new.removeClass('invisible').removeClass('flip').removeClass('loading');
           $new.find('span').text(t_pulldown_to_update);
           $body.animate({scrollTop:loaderHeight}, '500', 'swing');
       }

       function changeToUpdating() {
            $new.removeClass('flip').addClass('loading');
            $new.find('span').text(t_updating);
           // $body.scrollTop(loaderHeight - 16);
           $body.animate({scrollTop:loaderHeight - 16}, '500', 'swing');
           // $list.css({'-webkit-transform':'translate3d(0,' + threshold + 'px, 0)'});
       }

       function changeToReleaseToUpdate() {
           $new.find('span').text(t_release_to_update);
           $new.addClass('flip');
       }

       function changeToPulldownToUpdate() {
            $new.removeClass('invisible').removeClass('flip').removeClass('loading');
            $new.find('span').text(t_pulldown_to_update);
       }
       

        $(list).on('loadmore:end loadnew:end', function() {
            // loader.style.display = "none";
            backToOriginal();
        });
       
        function loadNewData(){
            // alert('loadata');
            utils.debug.log('refresher fire "loadnew:load"');
            $(list).trigger('loadnew:load');
            changeToUpdating();
         
        }

        var headerHeight = 40 + 30 - loaderHeight;
        function isElementInViewport (el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.top >= headerHeight &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        }


    }
    
    $.fn.ensureSwiper =  function(){
    	var $ele    = $(this.get(0));
    	
    	var minHeight  = $ele.height();
    	
    	$ele.find('.swiper-slide').css({minHeight: minHeight});
    	
    	makeVertialSwiper($ele, {
			mode: 'vertical',
			scrollContainer: true
    	});
    }
	
	$.fn.ensureVerticalScroll = $.fn.vscroll = function(useSwiper){
		
		if(!arguments.length){
			useSwiper =  false;
		}
		
		var isTouch = !!('ontouchstart' in window);
		var $ele    = $(this.get(0));
		var minHeight  =  window.baseMinHeight;
		
		if($ele.id() == '#content'){
            $(document.body).scrollTop(0);
			$ele.css({'min-height': minHeight});
		}

        if($ele.id() == '#content-bottom'){
            $ele.css({'min-height': minHeight});
        }

        if ( $('body').hasClass('android23') && $('#search_view_holder').length ) {
        	$ele.css({ 'padding-top': 0 });
        	$('#search_view_holder').css({ 'position': 'static' });
        }

        // fix issue position of footer after scroll appear
        $('.footer').css({ 'top': minHeight - 37 });
		
		// fix height of content
		buildIndicator($ele);
		
		if(!useSwiper){
			ensurePullToLoadWithNativeScroller($ele);
		
		// // scroll with device & native scroll support
		// if (isTouch && template != 'android') {
			// $ele.addClass('native-vscroll');
			// ensurePullToLoadWithNativeScroller($ele);
		// } else {
			initPullDownToRefresh(this.get(0));
			// // makeVertialSwiper($ele, {
			// // 	scrollContainer: true,
			// // 	mousewheelControl: true,
			// // 	mode: 'vertical'
			// // });
		// }
		}else{
			$ele.css({height: 350});
			 makeVertialSwiper($ele, {
			 	scrollContainer: true,
			 	mousewheelControl: true,
			 	mode: 'vertical'
			 });
		}
		
		return $ele;
	}
	
	$.fn.swiper =  function(options)
	{
		var $this  = $(this.get(0));
		var key = 'swiper';
		var swiper = $this.data(key);
		
		if(!swiper)
		{
			var id  = $this.id();
			// debug.log('initialized swiper: ', id);
			swiper = new Swiper($this.get(0), options);
			
			$this.data(key,swiper);
			
			$this.on('refresh',function(){
				if(swiper && swiper.reInit){
					swiper.reInit();
				}
			});
		}
		return swiper;
	}
});


