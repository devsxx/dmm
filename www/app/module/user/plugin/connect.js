define([
	'utils'
],function(utils){
	
	var connect_facebook_url =  'http://product-dev.younetco.com/mobile/se460/?m=lite&name=facebook&module=ynmobile';
	var twitter_connect_url = 'http://namnv.local/connect/twitter.php';
	var facebook_token = '';
	
	function get_facebook_profile(){
		$.getJSON('https://graph.facebook.com/me',
		{'access_token': facebook_token},
		function(json){
			alert(JSON.stringify(json));
		});
	}
	
	function connect_facebook()
	{
		var ref = window.open(encodeURI(connect_facebook_url), '_blank','location=no,status=no');
		
		ref.addEventListener('loadstop',function(evt){
			// ref.close();
			var url = evt.url;
			
			var token = /\?access_token=(.+)$/.exec(url);
  			var error = /\?error=(.+)$/.exec(url);
  			
  			if(token)
  			{
  				facebook_token = token.pop();
  				ref.close();
  				
  				get_facebook_profile();
  			}
  			
  			if(error)
  			{
  				ref.close();
  				error = error.pop();
				alert(error);
  			}
		});
	}
	
	function connect_twitter()
	{
		var ref = window.open(encodeURI(connect_twitter_url), '_blank','location=no');
		
		ref.addEventListener('loadstart',function(event){
			ref.close();
		});
		
		ref.addEventListener('loadstop',function(event){
			ref.close();
		});
		
	}
	
	utils.observer.on('connect:facebook',connect_facebook);
	
	utils.observer.on('connect:twitter',connect_twitter);
});
