define([
    'text!forum/tpl/forum-search.html'
], function(text) {

    return Backbone.View.extend({
        region: {
            holder: '#search_view_holder'
        },
        className: 'search-area',
        template: _.template(text),
        render: function(query) {

            this.query = $.extend({
                sKeyword: '',
                sForumIds: 0,
                sSearchType: 'thread'
            }, query);

            this.$el.html(this.template(this.query));

            this.$adv_search_holder = this.$el.find('#adv_search_holder');
            this.$search_forum_holder = this.$el.find('#search_forum_holder');
            this.$search_keywords = this.$el.find('#search_keywords');
            this.$search_result = this.$el.find('#search_result');

            return this;
        },
        inject: function() {

            $(this.region.holder).html(this.$el);

            this.fetchData();

            return this;
        },
        fetchData: function() {
            utils.api.get('forum/getforumsearch', {}, {
                context: this
            }).done(this.updateView);
        },
        updateView: function(data) {

            if (data.error_code) {
                return utils.modal.alert(data.error_message);
            }

            this.$search_forum_holder.html(this.getForumSelectHtml(data));

            this.$search_forum = this.$el.find('#search_forum');
        },
        getForumSelectHtml: function(data) {

            var html = '<select class="control-full" id="search_forum">';
            html += '<option value="">' + _t('All Forums') + '</option>';
            html += this.addForumOptionHtml(data, '');
            html += '</select>';

            return html;
        },
        addForumOptionHtml: function(aForums, prefix) {

            var html = '';

            _.each(aForums, function(oForum) {

                html += '<option value="' + oForum.iForumId + '"';

                if (oForum.iForumId == this.query.sForumIds) {
                    html += ' selected="selected"'
                }

                html += '>' + prefix + oForum.sName + '</option>';

                // append childs
                html += this.addForumOptionHtml(oForum.aSubForum, prefix + '&nbsp;&nbsp;&nbsp;');

            }, this);

            return html;
        },
        events: {
            "click #adv_search_toggle_btn": "toggleAdvSearch",
            "click #search_icon": "submitSearch",
            "click #search_btn": "submitSearch"
        },
        toggleAdvSearch: function(evt) {
            this.$adv_search_holder.toggleClass("hide");
        },
        submitSearch: function() {

            if (!this.$search_keywords.val().trim()) {
                return utils.modal.alert(_t('Please provide keyword'));
            }

            this.$adv_search_holder.addClass('hide');

            var query = {
                sKeyword: this.$search_keywords.val() || '',
                sForumIds: this.$search_forum.val() || '',
                sSearchType: this.$search_result.val() || 'thread'
            };

            window.location.href = '#forum_search/' + btoa(JSON.stringify(query));
        }
    });

});