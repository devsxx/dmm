define([
	'utils/plugin/observer'
],function(observer){
	
	function BlockUI(){
		this.isShown = false;
		this.$el  =  $('#blockui');
		this.$stage    = $('#blockui-stage');
		this.$content  = $('#blockui-content');
		
		this.show = function(content){
			if(true  == this.isShown)
			{
				return this.isShown = true;
			}
			
			if(!content){
				content  = '';
			}
			
			this.$stage[content?'removeClass':'addClass']('hide');
			
			this.$content.html(content);
			
			this.isShown =  true;
			
			
			$(document.body).addClass('blockui-open');
			
			this.$el.addClass('open');
			
			return this;
		}
		
		
		this.content = function(content){
			
			this.$stage[content?'removeClass':'addClass']('hide');
			
			this.$content.html(content);
			return this;
		}
		
		this.hide = function(){
			if(false == this.isShown)
			{
				return this.isShown = false;
			}
			
			this.isShown = false;
			
			
			this.$el.removeClass('open');
			
			this.$content.html(' ');
			
			$(document.body).removeClass('blockui-open');
		}
	}
	
	var _blockui = new BlockUI;
	
	observer.on('blockui',function(){
		_blockui.show();
	})
	.on('releaseui',function(){
		_blockui.hide();
	})
	
	return _blockui;
});
