define(function() {
    return {
        checkToAddHttpIntoLinkIfNeccessary: function(str) {
            if (!str.match(/^[a-zA-Z]{1,5}:\/\//)) {
                str = 'http://' + str;
            }

            return str;
        },
        shorten: function(sString, iLength, sPad) {
            if (!sString) {
                return '';
            }

            if (sString.length > iLength) {
                sString = sString.substr(0, iLength) + sPad;
            }

            return sString;
        },
        parseExternalLink: function(str) {

            var patt = /<a([^>]+)href\s*="([^"]*)"([^>]*)>/ig;

            return str.replace(patt, '<a$1rel="externallink" data-url="$2"$3>');
        },
        getObjPropByPatt: function(object, pattern) {

            for (var key in object) {
                if (pattern.test(key)) {
                    return object[key];
                }
            }

            return false;
        },
        getSubCategories: function(aCategory, iParentId) {

            var aSub = [];

            for (var i in aCategory) {
                if (aCategory[i].category_id == iParentId) {
                    return aCategory[i].sub;
                } else {
                    aSub = this.getSubCategories(aCategory[i].sub, iParentId);
                    if (aSub.length > 0) {
                        return aSub;
                    }
                }
            }

            return aSub;
        },
        getSubCategoriesHtml: function(aCategory, iParentId, aSelected) {

            aSelected = aSelected || [];

            var aSub = this.getSubCategories(aCategory, iParentId);

            if (aSub.length == 0 || !iParentId) {
                return '';
            }

            var selected = 0;

            var html = '<select class="control-full listing-form-category">';

            html += '<option value="">' + _t('Select Sub-Category') + '</option>';

            _.each(aSub, function(sub) {

                html += '<option value="' + sub.category_id + '"';

                if (aSelected.indexOf(sub.category_id) > -1) {
                    html += ' selected="selected"';
                    selected = sub.category_id;
                }

                html += '>' + sub.name + '</option>';
            });

            html += '</select>';

            html += '<div class="listing-form-category-subs-holder">' + this.getSubCategoriesHtml(aCategory, selected, aSelected) + '</div>';

            return html;
        }
    };
});