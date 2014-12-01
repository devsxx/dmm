define(function() {
	var ID = +new Date();

	$.fn.id = function() {
		var $this = $(this.get(0));
		var id = $this.prop('id');
		
		if (!id) {
			id = ++ID;
			$this.attr('id', 'eid_' + id);
		}
		return '#' + id;
	}

	$.newElenentId = function() {
		return '_' + (++ID);
	}
	
	$.fn.isDisabled =  function(){
		if(!arguments.length){
			return this.hasClass('disabled');
		}
		arguments[0] ? this.addClass('disabled') : this.removeClass('disabled');
	}
	
	/**
	 * ele.isProccessing(false) => remove class processing
	 * ele.isProccessing(true) => add class processing
	 * ele.isProccessing()     => check is processing 
	 */
	$.fn.isProcessing = function(){
		if(!arguments.length){
			return this.hasClass('processing');
		}
		arguments[0] ? this.addClass('processing') : this.removeClass('processing');
	}
}); 