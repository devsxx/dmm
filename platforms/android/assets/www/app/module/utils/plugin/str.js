define([
    'underscore.string',
    'cutstring',
], function(STR) {

    STR.cutHtml = require('cutstring');

    STR.reEscapeHTML = function(str) {

        return _.string.escapeHTML(str).replace(/&amp;/gi, '&');
    }

    STR.shorten = function(str, max, flag) {

        var strippedStr = _.string.unescapeHTML(STR.stripTags(str));

        var len = strippedStr.length;

        if (len <= max) {
            return flag ? str : _.string.reEscapeHTML(strippedStr);
        }

        if (!flag) {
            return _.string.reEscapeHTML(STR.truncate(strippedStr, max, '...'));
        }

        return '<span class="shorten-text-less">' + _.string.reEscapeHTML(strippedStr.substring(0, max)) + ' ...</span>' + '<a class="shorten-link-more" rel="shorten"> ' + _t('more') + ' </a>' + '<span class="shorten-text-more hide">' + str + '</span>' + '<a class="shorten-link-less hide" rel="shorten"> ' + _t('less') + ' </a>';
    }

    STR.shortenHtml = function(str, max, flag) {

        var len = STR.stripTags(str).length;

        if (len <= max) {
            return str;
        }

        if (!flag) {
            return STR.cutHtml(str, max);
        }

        var less = str.substring(0, max);
        var more = str.substring(max);

        var result = '<span class="shorten-text-less">' + STR.cutHtml(str, max) + ' ...</span>' + '<a class="shorten-link-more" rel="shorten"> ' + _t('more') + ' </a>' + '<span class="shorten-text-more hide">' + str + '</span>' + '<a class="shorten-link-less hide" rel="shorten"> ' + _t('less') + ' </a>';

        return result;
    }

    return STR;
});