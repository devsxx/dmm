var template = 'iphone';

var constants = {

    // live server
    home: '#newsfeed',
    siteUrl: 'http://mfox.younetco.com/',
    apiUrl: 'http://mfox.younetco.com/v3.07/module/mfox/api.php/',
    cometApiUrl: 'http://mfox.younetco.com/cometchat/cometchat_api.php?q=',

    // for development
    // home: 		'#newsfeed',
    // siteUrl: 	    'http://product-dev.younetco.com/mobile/fox360/',
    // apiUrl:  	    'http://product-dev.younetco.com/mobile/fox360/module/mfox/api.php/',
    // cometApiUrl:  'http://product-dev.younetco.com/mobile/fox360/cometchat/cometchat_api.php?q=',

    // for development 2
    // home: '#forums',
    // siteUrl: 'http://product-dev.younetco.com/annt/fox377a/',
    // apiUrl: 'http://product-dev.younetco.com/annt/fox377a/module/mfox/api.php/',
    // cometApiUrl: 'http://product-dev.younetco.com/annt/fox377a/cometchat/cometchat_api.php?q=',

    // for development 3
    // home: '#newsfeed',
    // siteUrl: 'http://product-dev.younetco.com/lytk/phpfox360s2/',
    // apiUrl: 'http://product-dev.younetco.com/lytk/phpfox360s2/module/mfox/api.php/',

    // for development 3
    // home: '#newsfeed',
    // siteUrl: 'http://product-dev.younetco.com/lytk/phpfox376/',
    // apiUrl: 'http://product-dev.younetco.com/lytk/phpfox376/module/mfox/api.php/',

    // for QC
    // home: '#newsfeed',
    // siteUrl: 'http://product-qc.younetco.com/phpfox3demo/',
    // apiUrl: 'http://product-qc.younetco.com/phpfox3demo/module/mfox/api.php/',
    // cometApiUrl: 'http://product-qc.younetco.com/phpfox3demo/cometchat/cometchat_api.php?q=',

    // check Tablet version
    isTablet: false,

    token: '',
    theme: 'iphone',
    template: 'iphone', // set template to load.
    platform: 'ios',
    device: 'iphone',
    applePushPlatformName: 'ios', // ios, ipad
    googleCloudMessageSenderId: '561554585734',

    TIME_REQUEST_NOTIFICATION_MILISECONDS: 60000,
    USER_MINIMUM_YEAR_OLD: 16,
    USER_MAXIMUM_YEAR_OLD: 116,
    NUMBER_ITEM_LOAD_FROM_SERVER: 10,
    NUMBER_ITEM_SCROLL: 6,
    MAXIMUM_ITEM_NOTIFICATION_ON_HEADER_BAR: 3,
    GOOGLE_API_KEY: 'AIzaSyAbT_waGAuZ-LqLjcTQWzY3dJ8RJbovPeI',

    // define supported languages.
    languages: {
        en: true,
        vi: true
    }
};

var Debug = true;