define(function(){
    utils.headline.add('share',function(item, context){

        var params = item.getParam();

        // strip tags here.

        var type  =  (params.type || '').replace(/(<a [^>]+>)([^<]+)+(<\/a>)+/ig,'$2') || 'post';

        switch (item.getSharedItemType()) {

            case 'pages':
                return _t('shared a page');
                break;

            case 'quiz':
                return _t('shared a quiz');
                break;

            default:
                return _t('%s ၏ %s ကို မွ်ေ၀ထားသည္', item.getSharedUserLink(), type);
                break;
        }
    });
});
