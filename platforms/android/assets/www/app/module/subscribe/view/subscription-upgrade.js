define([
    'text!subscribe/tpl/subscription-upgrade.html',
    'subscribe/view/subscription-upgrade-list'
],function(text, ListView){

    return Backbone.View.extend({
        region: {
            holder: '#main',
            scroller: '#content'
        },
        template: _.template(text),
        initialize: function(){

        },
        render: function(){

            this.$el.html(this.template());

            return this;
        },
        inject: function(params){

            var $holder = $(this.region.holder).html(this.$el);

            this.$scroller = $(this.region.scroller);

            this.$scroller.ensureVerticalScroll(); // enable scrollable

            this.$userTitle = this.$el.find('#user_title');

            this.fetchData(); // get user level

            this.listView  = new ListView({},
                this.$el.find('#subscription_list_holder'),
                this.$scroller,
                {
                    loadmore: false,
                    loadnew: false
                });


            // render list view
            this.listView.render({sView: 'upgrade'}).inject();

            return this;
        },
        fetchData: function() {

            var settings = {
                context: this
            };

            utils.api.post('user/getusergroupinfo', {}, settings).done(this.fetchDone).fail(this.fetchFail);
        },
        fetchDone: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server'));
            }
            // change user title
            this.$userTitle.html(data.sTitle);

        },
        fetchFail: function(jqXHR, textStatus, errorThrown) {

            utils.debug.warn('user/getusergroupinfo', arguments);
        }
    });
});

