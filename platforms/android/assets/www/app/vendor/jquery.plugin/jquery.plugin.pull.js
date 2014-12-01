/*!
* jquery.plugin.pullToRefresh.js
* version 1.0
* author: Damien Antipa
* https://github.com/dantipa/pull-to-refresh-js
*/
(function( $ ){

	$.fn.loadnew = function() {
		
		var isTouch = !!('ontouchstart' in window);
		
		return this.each(function() {
			
			if (!isTouch) {
				return ;
			}

			var e = $(this),
				content = e.find('.swiper-wrapper'),
				loadNewIndicator = e.find('.loadnew-indicator').first(),
				loadMoreIndicator = e.find('.loadmore-indicator').first(),
				ptrHeight = 30,
				loadingNew = false,
				loadingMore = false,
				isLoadNew = false,
				isLoadMore = false,
				height = 0,
				hasLoadMore  = loadMoreIndicator.length,
				hasLoadNew   = loadNewIndicator.length;
				
			if(hasLoadNew){
				
				console.log('has loadnew');
				// trigger on loadnew
				e.on('loadnew:start',function(){
					console.log('loadnew:start');
					loadNewIndicator.addClass('start').removeClass('hide');
				})
				.on('loadnew:load',function(){
					console.log('loadnew:load');
					loadNewIndicator.removeClass('start').addClass('loading');
				})
				.on('loadnew:end',function(){
					console.log('loadnew:end');
					loadingNew = false;
					loadNewIndicator.removeClass('start').removeClass('loading').addClass('hide');
				});
			}
			
			// trigger on loadmore
			if(hasLoadMore){
				console.log('has loadmore');
				e.on('loadmore:start',function(){
					console.log('loadmore:start');
					loadMoreIndicator.addClass('start').removeClass('hide');
					
				})
				.on('loadmore:load',function(){
					loadMoreIndicator.removeClass('start').addClass('loading');
				})
				.on('loadmore:end',function(){
					
					console.log('loadmore:end')
					
					loadingMore = false;
					loadMoreIndicator.removeClass('loading').addClass('hide');
				});
			}

			content.on('touchstart', function (ev) {
				if (e.scrollTop() === 0) { // fix scrolling
					e.scrollTop(1);
				}
				isLoadNew = isLoadMore = false;
				height = content.height() - e.height();
				
			}).on('touchmove', function (ev) {
				
				if (isLoadNew || loadingNew) { 
					// if is already loading -> do nothing
					if(!hasLoadMore){
						return true;	
					}
					
				}
				
				var top = e.scrollTop();
				
				if (hasLoadNew && height >0 && !loadingNew && -top > ptrHeight) { // release state
					isLoadNew = true;
					loadingNew = true;
					e.trigger('loadnew:start');
				}
				
				if(hasLoadMore && !loadingMore && height >0 && top > height + ptrHeight){
					isLoadMore = true;
					loadingMore = true;
					e.trigger('loadmore:start');
				}
				
			}).on('touchend', function(ev) {
				
				var top = e.scrollTop();
				
				if (isLoadNew) { // loading state
					console.log('loadnew:load');
					e.trigger('loadnew:load');
				}
				
				if(isLoadMore){
					console.log('loadmore:load');
					e.trigger('loadmore:load');
				}
			});
		});

	};
})( jQuery );
