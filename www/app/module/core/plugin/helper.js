define([
	'text!core/tpl/partial-loadmore.html',
	'text!core/tpl/partial-loadnew.html',
	'text!core/tpl/partial-not-found.html',
	'text!core/tpl/partial-not-more.html',
	'text!core/tpl/partial-private-page.html',
	'text!core/tpl/partial-permission-deny.html',
	'text!chat/tpl/chat-header-btn.html',
	'text!comet/tpl/chat-header-btn.html'
],function(loadmore, loadnew){
	
	var tpl_loadmore     =  _.template(require('text!core/tpl/partial-loadmore.html'));
	var tpl_loadnew      =  _.template(require('text!core/tpl/partial-loadnew.html'));
	var tpl_notmore      =  _.template(require('text!core/tpl/partial-not-more.html'));
	var tpl_notfound     =  _.template(require('text!core/tpl/partial-not-found.html'));
	var tpl_privatepage  =  _.template(require('text!core/tpl/partial-private-page.html'));
	var tpl_permission_deny  = _.template(require('text!core/tpl/partial-permission-deny.html'));
	var tpl_chat_header_btn = _.template(require('text!chat/tpl/chat-header-btn.html'));
	var tpl_cometchat_header_btn = _.template(require('text!comet/tpl/chat-header-btn.html'));
	
	utils.helper.loadmore = function(context){
		return tpl_loadmore(context);
	};
	
	utils.helper.loadnew = function(context){
		return tpl_loadnew(context);
	};
	
	/**
	 * reqire message
	 */
	utils.helper.notfound = function(msg){
		return tpl_notfound({msg: msg});
	};
	
	/**
	 * require message
 	 * @param {Object} context
	 */	
	utils.helper.notmore = function(msg){
		return tpl_notmore({msg:msg});
	};
	
	utils.helper.privatepage = function(context){
		
		return tpl_privatepage($.extend({phrase: 'You do not have permission to view this private page.'},context));
	};
	
	utils.helper.permission_deny=function(context){
		return tpl_permission_deny($.extend({phrase: 'You do not have permission to view this private page.'},context));
	}
	
	utils.helper.chat_header_btn = function(){
		if (utils.setting.get('cometchat_enabled')){
			return tpl_cometchat_header_btn();
		}else
		if(utils.setting.get('chat_enabled') && utils.setting.get('chat_module')){
			return tpl_chat_header_btn();
		} 
		return '';
	}
});
