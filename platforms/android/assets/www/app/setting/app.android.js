require.config({
    baseUrl: './',
    packages: [{
        name: 'language',
        location: './app/language'
    }, {
        name: 'utils',
        location: './app/module/utils'
    }, {
        name: 'core',
        location: './app/module/core'
    }, {
        name: 'like',
        location: './app/module/like'
    }, {
        name: 'dislike',
        location: './app/module/dislike'
    }, {
        name: 'comment',
        location: './app/module/comment'
    }, {
        name: 'search',
        location: './app/module/search'
    }, {
        name: 'share',
        location: './app/module/share'
    }, {
        name: 'rate',
        location: './app/module/rate'
    }, {
        name: 'report',
        location: './app/module/report'
    }, {
        name: 'activity',
        location: './app/module/activity'
    }, {
        name: 'request',
        location: './app/module/request'
    }, {
        name: 'message',
        location: './app/module/message'
    }, {
        name: 'notification',
        location: './app/module/notification'
    }, {
        name: 'activity',
        location: './app/module/activity'
    }, {
        name: 'link',
        location: './app/module/link'
    }, {
        name: 'user',
        location: './app/module/user'
    }, {
        name: 'friend',
        location: './app/module/friend'
    }, {
        name: 'photo',
        location: './app/module/photo'
    }, {
        name: 'video',
        location: './app/module/video'
    }, {
        name: 'music',
        location: './app/module/music'
    }, {
        name: 'template',
        location: './app/template'
    }, {
        name: 'event',
        location: './app/module/event'
    }, {
        name: 'forum',
        location: './app/module/forum'
    }, {
        name: 'chat',
        location: './app/module/chat'
    }, {
        name: 'comet',
        location: './app/module/comet'
    }, {
        name: 'attachment',
        location: './app/module/attachment'
    }, {
        name: 'blog',
        location: './app/module/blog'
    }, {
        name: 'page',
        location: './app/module/page'
    }, {
        name: 'quiz',
        location: './app/module/quiz'
    }, {
        name: 'forum',
        location: './app/module/forum'
    }, {
        name: 'poll',
        location: './app/module/poll'
    }, {
        name: 'marketplace',
        location: './app/module/marketplace'
    }, {
        name: 'subscribe',
        location: './app/module/subscribe'
    }],
    paths: {
        /// backbone.
        backbone: './app/vendor/backbone/backbone',
        text: './app/vendor/requirejs-text/text',
        json: './app/vendor/requirejs-json/json',
        jquery: './app/vendor/jquery/dist/jquery.js',
        underscore: './app/vendor/underscore/underscore',
        fastclick: './app/vendor/fastclick/lib/fastclick',
        bpopup: './app/vendor/bpopup/jquery.bpopup',
        swiper: './app/vendor/swiper/dist/idangerous.swiper',
        SocialConnect: './app/vendor/socialconnect/socialconnect',
        // weinre : 'http://localhost:8080/target/target-script-min.js#anonymous',
        beeber_box: './app/vendor/jquery.plugin/jquery.beeber_box',
        // pullToRefresh: './app/vendor/jquery.plugin.pullup',
        // supported html player, required for module music.
        CONTROLLER_PLAYER: './app/vendor/htmlplayer/controller_player',
        MediaElelementPlayer: './app/vendor/htmlplayer/mediaelement-and-player',
        // jcrop library
        jcrop: './app/vendor/jcrop/js/jquery.Jcrop',
        jcolor: './app/vendor/jcrop/js/jquery.color',
        'jquery.i18n': './app/vendor/jquery-i18n/jquery.i18n',
        'moment': './app/vendor/momentjs/moment',
        'numeral': './app/vendor/numeral/numeral',
        'underscore.string': './app/vendor/underscore.string/underscore.string',
        'cutstring': './app/vendor/htmlcut/cutstring',
        'iScroll': './app/vendor/iscroll/iscroll',

        //image cache library << Nay 
        'imgcache': './app/vendor/imgcache.js/js/imgcache'
    },
    config: {
        text: {
            template: 'android'
        }
    },
    // prevent timeout error
    waitSeconds: 10,
    map: {},
    shim: {
        fastclick: {
            exports: 'Fastclick'
        },
        beeber_box: {},
        CONTROLLER_PLAYER: {
            deps: ['MediaElelementPlayer'],
            exports: 'CONTROLLER_PLAYER'
        },
        jcrop: {
            exports: 'jcrop'
        },
        jcolor: {
            exports: 'jcolor'
        },
        SocialConnect: {
            exports: 'SocialConnect'
        }
        // 'backbone' : {
        // deps : ['underscore', 'jquery'],
        // exports : 'Backbone'
        // },
        // 'underscore' : {
        // exports : '_'
        // }
    }
});

// treat this code for reactive webview after inject an iframe.
require([
    'utils',
    'core',
    'like',
    'dislike',
    'comment',
    'share',
    'rate',
    'report',
    'user',
    'activity',
    'request',
    'friend',
    'message',
    'link',
    'notification',
    // extends plugins
    'video',
    'photo',
    'music',
    'event',
    'chat',
    'forum',
    // 'comet',
    'blog',
    'page',
    'poll',
    'quiz',
    'marketplace',
    'subscribe'
], function() {

    // trigger app init
    utils.observer.trigger('app:init');

    Backbone.history.start();

    // trigger app started
    utils.observer.trigger('app:run');
    alert("app:run");
});