define([
	'jquery.i18n', 
	'json!language/mmr.json', 
	'json!language/mmr_custom.json'
], function(jquery_i18n, _default, custom) {

	$.i18n.load(_default, 'mmr');
	$.i18n.load(custom,'mmr');

	return $.i18n;
})
