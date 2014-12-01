define([
	'bpopup', 
	'utils/plugin/observer',
	'utils/plugin/history'
], function(bpopup, observer) {
	function ModalPopup() {
		var isShown = false
		  , $wrapper = $('#simple-popup')
		  , _defaults = {}
		  , _$ele = false;

		_defaults.onClose = function() {
			isShown = false;
			$(document.body).removeClass('popup-open');
		}
		_defaults.onOpen = function() {
			isShown = true;
			$(document.body).addClass('popup-open');
		}

		this.close = function() {

			$(document.body).removeClass('popup-open');
			
			if (false == isShown) {
				return isShown = false;
			}

            isShown = false;
			$wrapper.close();
			return this;
		}

		this.open = function($ele, openCallback) {

			
			if(this.isShown && $wrapper.close ){
				$wrapper.close();
			}

			$wrapper.html($ele).bPopup.call($wrapper, _defaults, openCallback);

			isShown = true;
			
			return this;
		}
		
		this.isShown = function(){
			return isShown;
		}
	}

	var _popup = new ModalPopup();
	
	observer.on('router:changed', function(){
		if(_popup.isShown()){
			_popup.close();
		}
	});
	
	return _popup;
});
