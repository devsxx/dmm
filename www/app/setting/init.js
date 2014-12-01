+ function() {

    // define load theme
    // var theme = 'ipad';
    // constants.theme = theme;	

    var linkCSS = '<link href="app/build/css/' + constants.theme + '.css" type="text/css" rel="stylesheet" />';

    // define load app js
    document.write(linkCSS);

    // disable debug info for better performance

    if (!Debug) {
        console.log = function() {};
    }

    window.baseMinHeight = window.innerHeight + 1;

    document.addEventListener("deviceready", function() {
        var ynplatform = device.platform,
            ynversion = device.version,
            version_major = ynversion.replace(/\./g, "").substr(0, 2);

        constants.os_version = version_major;

        // check ios device
        if (ynplatform === 'iOS') {
            ynversion = parseInt(ynversion);
            $(document.body).addClass(ynplatform.toLowerCase() + ynversion);
        }

        // check android device
        if (ynplatform === 'Android') {

            $(document.body).addClass(ynplatform.toLowerCase() + version_major);
        }

        window.baseMinHeight = window.innerHeight + 1;

    }, false);

    $(document).ready(function() {

        var scroll = document.createElement('script');
        scroll.setAttribute('type', 'text/javascript');
        scroll.setAttribute('src', 'app/vendor/scroller/scroller.' + constants.platform + '.js');

        $(scroll).appendTo(document.body);

        var element = document.createElement('script');
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('data-main', "app/build/js/app." + constants.template + ".js");
        element.setAttribute('src', 'app/vendor/requirejs/require.js');

        $(element).appendTo(document.body);

        if (constants.platform == 'android') {
            $(document.body).append('<style type="text/css">' + '.page-request {-webkit-transform: translate(-45px, -' + (window.baseMinHeight - 45) / 2 + 'px) scale(0, 0); }' + '.page-message {-webkit-transform: translate(0, -' + (window.baseMinHeight - 45) / 2 + 'px) scale(0, 0); }' + '.page-notification {-webkit-transform: translate(45px, -' + (window.baseMinHeight - 45) / 2 + 'px) scale(0, 0); }' + '</style>');
        }
    });
}();