define([
    'attachment/model/attachment-photo',
    'attachment/view/attachment-photo-detail',
    'fastclick'
], function(PhotoModel, PhotoDetailView, Fastclick) {

    var observer = {};

    _.extend(observer, Backbone.Events);

    ('ontouchstart' in window) && FastClick.attach(document.body);

    $(document.body).on('click', '[clickable="true"]', function(evt) {

        var ele = $(this),
            key = 'click',
            name = ele.data(key);

        if (!name) {
            return;
        }

        observer.trigger(name, ele, evt);

        evt.preventDefault();
    });

    $(document).on('click', '[rel="delegate"]', function(evt) {

        if (!evt) {
            return false;
        }

        evt.preventDefault();

        $el = $(evt.currentTarget);

        var id = $el.attr('id') || '';

        if (!id) {
            return false;
        }

        var parts = id.split('-');

        var delegateEventName = parts.shift();
        var delegateElementId = parts.join('-');
        var data = $el.data();
        data.id = id;

        $('#' + delegateElementId).trigger(delegateEventName, data);

    }).on('click', '[rel="link"]', function(evt) {

        if (!evt) {
            return false;
        }

        var $target = $(evt.target),
            rel = $target.attr('rel') || 'link';

        if (rel != 'link') {
            return false;
        }

        // find closest relative item
        if ($target.closest('.prevent').length || $target.hasClass('prevent')) {
            return false;
        }

        if ($target.get(0).tagName == 'A') {
            var url = $target.attr('href');
            if (url) {
                window.location.href = url;
            }
            return false;
        }

        var $el = $(evt.currentTarget);
        var url = $el.data('url');

        if (url) {
            window.location.href = url;
        }
    }).on('click', '[rel="externallink"]', function(evt) {

        if (!evt) {
            return false;
        }

        var $target = $(evt.target),
            rel = $target.attr('rel') || 'externallink';

        if (rel != 'externallink') {
            return false;
        }

        // find closest relative item
        if ($target.closest('.prevent').length || $target.hasClass('prevent')) {
            return false;
        }

        if ($target.get(0).tagName == 'A') {
            var url = $target.attr('href');
            if (url) {
                return window.location.href = url;
            }
        }

        var $el = $(evt.currentTarget);
        var url = $el.data('url');

        if (url) {
            window.open(url, '_blank', 'location=yes');
        }
    }).on('click', '[rel="shorten"]', function(evt) {

        if (!evt) {
            return false;
        }

        var $ele = $(evt.currentTarget),
            $parent = $ele.parent();

        $parent.find('.shorten-link-less').toggleClass('hide');
        $parent.find('.shorten-link-more').toggleClass('hide');
        $parent.find('.shorten-text-less').toggleClass('hide');
        $parent.find('.shorten-text-more').toggleClass('hide');

        // correct scroller.
        $parent.closest('.content').trigger('refresh');

        evt.preventDefault();
    }).on('click', '[rel="photodetail"]', function(evt) {

        if (!evt) {
            return false;
        }

        var $ele = $(evt.currentTarget);
        var item = new PhotoModel({
            photo_url: $ele.data('photourl')
        });

        new PhotoDetailView({
            model: item
        }).render().inject();
    });

    return observer;
});