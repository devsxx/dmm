define(function() {

    return Backbone.Model.extend({
        idAttribute: 'iListingId',
        defaults: {
            sModelType: 'marketplace',
            bCanView: true,
            bCanLike: true,
            bIsAllowBuyInApp: true
        },
        getCurrencySymbol: function() {
            return this.get('sSymbol') || '';
        },
        getCurrencyId: function() {
            return this.get('sCurrencyId') || '';
        },
        getPrice: function() {
            return this.get('sPrice') || 0;
        },
        getImageSrc: function() {
            return this.get('sMarketplaceImage') || '';
        },
        getCountry: function() {
            return this.get('sCountry') || '';
        },
        getCity: function() {
            return this.get('sCity') || '';
        },
        hasCity: function() {
            return this.getCity() ? true : false;
        },
        getLocation: function() {
            return this.getCountry() + (this.hasCity() ? (' » ' + this.getCity()) : '');
        },
        hasLocation: function() {
            return this.getLocation() ? true : false;
        },
        getMiniDescription: function() {
            return this.get('sMiniDescription') || '';
        },
        hasMiniDescription: function() {
            return this.getMiniDescription() ? true : false;
        },
        isFeatured: function() {
            return this.get('bIsFeatured') || false;
        },
        getCountryIso: function() {
            return this.get('sCountryIso') || '';
        },
        getCountryChildId: function() {
            return this.get('iCountryChildId') || 0;
        },
        getCategoryIds: function() {
            return this.get('aCategoriesId') || [];
        },
        isSell: function() {
            return this.get('bIsSell') || false;
        },
        getZipCode: function() {
            return this.get('sPostalCode') || '';
        },
        hasZipCode: function() {
            return this.getZipCode() ? true : false;
        },
        getPrivacyId: function() {
            return parseInt(this.get('iPrivacy')) || 0;
        },
        getPrivacyCommentId: function() {
            return parseInt(this.get('iPrivacyComment')) || 0;
        },
        getPhotos: function() {
            return this.get('aImages') || [];
        },
        hasPhotos: function() {
            return this.getPhotos().length > 0;
        },
        isPending: function() {
            return this.get('bIsPending') || false;
        },
        getCategory: function() {

            var sCategories = '';

            var aCategories = this.get('aCategoriesData') || [];

            _.each(aCategories, function(item, index) {
                sCategories += (index > 0 ? ' » ' + item[0] : item[0]);
            });

            return sCategories;
        },
        getTimeFormatted: function() {
            return utils.moment(this.getTimestamp() * 1e3).format('LL');
        },
        getText: function() {

            var sText = this.get('sDescription') || '';

            return utils.helper.parseExternalLink(sText);
        },
        getStoreKitPurchaseId: function() {
            return this.get('aStoreKitPurchaseId')[constants.device] || '';
        },
        canBuyInApp: function() {
            return this.get('bIsAllowBuyInApp');
        },
        showBuyInFullSite: function() {
            return this.get('bIsShowBuyInFullSite') || false;
        },
        getFullSiteUrl: function() {
            return this.get('sFullSiteUrl') || '';
        },
        hasFullSiteUrl: function() {
            return this.getFullSiteUrl() ? true : false;
        },
        getActionCount: function() {

            var cnt = 1;

            if (this.isSell() && this.getPrice() != 0) {
                if (this.canBuyInApp()) {
                    cnt++;
                }
                if (this.showBuyInFullSite() && this.hasFullSiteUrl()) {
                    cnt++;
                }
            }

            return cnt;
        },
        canSendMessage: function() {
            return this.get('bCanSendMessage') || false;
        },
        getSocialShareUrl: function() {
            
            if(this.getType() == 'marketplace')
                return constants.siteUrl + 'index.php?do=/marketplace/'+ this.getId();
                
            return constants.siteUrl + 'index.php?do=/advancedmarketplace/detail/'+ this.getId();
        }
    });
});