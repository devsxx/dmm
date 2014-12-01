define([
	'utils/plugin/i18n',
	'moment',
	'numeral',
	'utils/plugin/str',
	
	// require at first, do not change order of following lines
	// 'utils/plugin/i18n',
	'utils/plugin/blockui',
	// plugin
	'utils/plugin/setting',
	'utils/plugin/debug',
	'utils/plugin/support',
	'utils/plugin/api',
	'utils/plugin/livetime',
	'utils/plugin/observer',
	'utils/plugin/router',
	'utils/plugin/helper',
	'utils/plugin/attachment',
	'utils/plugin/headline',
	'utils/plugin/request-proxy',
	'utils/plugin/modal',
	'utils/plugin/layout',
	'utils/plugin/validator',
	'utils/plugin/popup',
	'utils/plugin/history',
	'utils/plugin/topmenu',
	
	// extend jquery object
	'utils/extend/jquery',
	'utils/extend/model',
	'utils/extend/view-polyplatform',
	'utils/extend/view-list-collection',
	'utils/extend/view',
	// 'utils/extend/swiper',
	'utils/extend/view-item',
	'utils/extend/view-list',
	'utils/extend/view-popup'
],function(){
	var modules = {
			
	};
	
	var utils =  {
		i18n: $.i18n,
		setting: require('utils/plugin/setting'),
		moment: require('moment'),
		str: require('utils/plugin/str'),
		numeral: require('numeral'),
		debug: require('utils/plugin/debug'),
		support: require('utils/plugin/support'),
		api: require('utils/plugin/api'),
		livetime: require('utils/plugin/livetime'),
		headline: require('utils/plugin/headline'),
		attachment: require('utils/plugin/attachment'),
		observer: require('utils/plugin/observer'),
		router: require('utils/plugin/router'),
		helper: require('utils/plugin/helper'),
		modal: require('utils/plugin/modal'),
		requestProxy: require('utils/plugin/request-proxy'),
		layout: require('utils/plugin/layout'),
		validator: require('utils/plugin/validator'),
		popup: require('utils/plugin/popup'),
		history: require('utils/plugin/history'),
		blockui: require('utils/plugin/blockui'),
		topMenu: require('utils/plugin/topmenu')
	}
	
	utils.addModule = function(name, option){
		modules[name]= $.extend({
			name: name,
			label: name,
			href: '#' + name
		},option);
	}
	
	utils.hasModule = function(name){
		return modules.hasOwnProperty(name);
	} 
	
	
	window._t = function(){
		return $.i18n._.apply($.i18n, arguments)	
	}
	
	window.utils = utils;
	
	return utils;
});
