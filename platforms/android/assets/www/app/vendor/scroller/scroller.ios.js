+ function(){
	"use strict";
	// work with native scroll.
		
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
			t_updating			= _t('Updating'),
			t_release_to_loadmore = _t('Release to load more'),
			t_pullup_to_loadmore  = _t('Pull up to load more'),
			check_height =  0
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
						console.log('release to update');
						if(has_new){
							$new.removeClass('invisible').find('span').text(t_release_to_update);
							$new.addClass('flip');
						}
					}
				}else 
				if (-top > ptr_height ) { // pull down to update 
					if(2 != loadnew_barrier){ // prevent duplicate check
						loadnew_barrier =  2;
						console.log('pull down to update');
						if(has_new){
							$new.removeClass('invisible').removeClass('flip').removeClass('loading');
							$new.find('span').text(t_pulldown_to_update);
						}
					}
				}else 
				if(-top > 0){
					if(1 != loadnew_barrier){
						loadnew_barrier =  1;
						// console.log('hide pull down to update');
						if(has_new){
							$new.addClass('invisible');
							$new.find('span').text('');
						}
					}
				}
			}
			
			if(!loadmore_state){
				if(top > check_height + release_height ){ 
					if(3 != loadmore_barrier){ // prevent duplicate check
						loadmore_barrier =  3;
						console.log('release to load more');
						if(has_more){
							$more.removeClass('invisible').addClass('flip');
							$more.find('span').text(t_release_to_loadmore);
						}
					}
				} else 
				if( top > check_height + ptr_height ){
					if(2 != loadmore_barrier){
						loadmore_barrier = 2;
						// prevent duplicate check
						console.log('pull up to load more');
						
						if(has_more){
							$more.removeClass('invisible').removeClass('flip').removeClass('loading');
							$more.find('span').text(t_pullup_to_loadmore);
						}
					}
				} else if( top > check_height ){
					if(1 != loadmore_barrier){
						loadmore_barrier = 1;
						// prevent duplicate check
						// console.log('pull up to load more');
// 						
						if(has_more){
							$more.addClass('invisible').removeClass('flip').removeClass('loading');
							$more.find('span').text('');
						}
					}
				}
			}
			
		}).on('touchend', function(ev) {
			
			if (loadnew_barrier == 3) { // loading state
				console.log('nativer scroll fire loadnew:load');
				$ele.data('loadnew_state',true).trigger('loadnew:load');
				if(has_new){
					$new.removeClass('flip').addClass('loading');
					$new.find('span').text(t_loading);
				}
				
			}
			if (loadmore_barrier == 3) { // loading state
				console.log('nativer scroll fire loadmore:load');
				$ele.data('loadmore_state',true).trigger('loadmore:load');
				if(has_more){
					$more.removeClass('flip').addClass('loading');
					$more.find('span').text(t_loading);
				}
			}
		});
	};
	
	function buildIndicator($ele){
		
		var 
		$new 				= $ele.find('.loadnew-indicator').first(),
		$more 				= $ele.find('.loadmore-indicator').first(),
		has_new 			= $new.length,
		has_more			= $more.length
		;
		
		 $ele
		 .on('loadnew:end',function(){
		 	console.log('loadnew:end');
		 	if('lock'!= ($ele.data('loadnew_state') || false)){$ele.data('loadnew_state',false);}
		 	if(has_new){
		 		$new.addClass('invisible');
		 		$el.scrollTop(30);
		 	}
		 })
		 .on('loadnew:lock',function(){
		 	console.log('loadnew:lock');
		 	$ele.data('loadnew_state', 'lock');
		 })
		 .on('loadnew:unlock',function(){
		 	console.log('loadnew:unlock');
		 	$ele.data('loadnew_state', false);
		 })
		 .on('loadmore:end',function(){
		 	console.log('loadmore:end');
		 	if('lock'!= ($ele.data('loadmore_state') || false)){$ele.data('loadmore_state',false);}
		 	if(has_more){
		 		$more.addClass('invisible');
		 	}
		 })
		 .on('loadmore:lock',function(){
		 	console.log('loadmore:lock');
		 	$ele.data('loadmore_state', 'lock');
		 })
		 .on('loadmore:unlock',function(){
		 	console.log('loadmore:unlock');
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
			t_updating			= _t('Updating'),
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
						// console.log('hide pull down to update');
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
	
	$.fn.ensureVerticalScroll = $.fn.vscroll = function(){
		
		var isTouch = !!('ontouchstart' in window);
		var $ele    = $(this.get(0));
		
		buildIndicator($ele);
		
		// scroll with device & native scroll support
		if(isTouch){
			$ele.addClass('native-vscroll');
			ensurePullToLoadWithNativeScroller($ele);
		}else{
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
}(jQuery);


