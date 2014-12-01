define(function(){
	
	var Modal = function(){
		this.toast = function(){
			console.info.apply(console, arguments);
		}
		this.alert  =  function(){
			window.alert.apply(window, arguments);
		}
		
		this.confirm = function(str, cb, title, labels){
            cb(window.confirm(str) ? 1 : 2); //cordova 3.3 change index from 1 NOT 0
		}
		
		this.promt = function(){
			return window.promt.apply(window, promt)
		}
	}
	
	var modal = new Modal;
	
	document.addEventListener('deviceready',function(){
		modal.alert = function(){
			return navigator.notification.alert.apply(navigator.notification, arguments);
		}
// 		
		modal.confirm = function(){
			return navigator.notification.confirm.apply(navigator.notitication, arguments);
		}
		
		modal.promt = function(){
			return navigator.notification.promt.apply(navigator.notification, arguments);
		}
		
		modal.toast = function(){
			return window.plugins.toast.showShortBottom.apply(window.plugins.toast,arguments);
		}
	});
	
	return modal;
});
