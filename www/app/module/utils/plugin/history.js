define(function() {

    var UtilHistory = function() {

        this._data = new Array();

        this._maxLength = 3;

        this._rootUrl = constants.home;

        this._lastUrl = null;

        this._popupIsShown = false;

        this._bottomIsShown = false;

        this.setPopupIsShown = function(flag) {
            this._popupIsShown = flag;
        }

        this.setBottomIsShown = function(flag) {
            this._bottomIsShown = flag;
        }

        this.clear = function() {
            this._data = new Array();
            this._lastUrl = null;
            return this;
        }

        this.getCurrentUrl = function() {
            var ptr = url = window.location.href.match(/(#.*)$/i);
            if (ptr) {
                return ptr.pop();
            };
            return this._data.pop();
        }

        this.rebuild = function(args) {
            if (arguments.length) {
                args.push(this.getCurrentUrl());
                this._data = args;
            } else {
                this._data = new Array(this.getCurrentUrl());
            }
            return this;
        }

        this.back = function() {

            this._lastUrl = '';
            var url = this._data.pop();

            if (url == this.getCurrentUrl()) {
                url = this._data.pop();
            };

            if (url) {
                window.location.href = url;
            } else {
                window.location.href = this._rootUrl;
            }
            return this;
        }

        this.go = function(seek) {
            var len = history._data.length,
                index = len - 1 + seek;

            if (index < 0 || index >= len) {
                return;
            }

            window.location.href = this._data[index];
        }

        this.goRoot = function() {
            window.location.href = this._rootUrl;
        }

        this.push = function(bIsRoot, url) {
            bIsRoot = bIsRoot || false;

            url = url || this.getCurrentUrl();

            if (bIsRoot) {
                utils.debug.log('change history root: ', url);
                this._rootUrl = url;
                this._data = [];
                return;
            }

            if (this._lastUrl != url) {
                if (this._data.length == this._maxLength) {
                    this._data.shift();
                }

                utils.debug.log('push to history: ', url);
                this._data.push(this._lastUrl = url);
            }
            return this;
        }
    }

    var _history = new UtilHistory();

    $(document).on('click', '[rel="back"]', function() {

        if (utils.layout.bottomIsShown()) {
            return utils.observer.trigger('bottom:close');
        }

        _history.back();
    });

    document.addEventListener("backbutton", function() {
        // lost connection
        if (Backbone.history.fragment == 'lost-connection') {
            return;
        }

        // is blocking UI?
        if (utils.blockui.isShown) {
            return;
        }

        if (utils.layout.bottomIsShown()) {
            utils.observer.trigger('bottom:close');
            return;
        }

        if (utils.popup.isShown()) {
            utils.popup.close();
            return;
        }

        _history.back();
    }, false);

    return _history;
});