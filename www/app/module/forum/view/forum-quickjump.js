define([
    'forum/model/forum',
    'text!forum/tpl/forum-quickjump.html'
], function(Model, text) {

    return Backbone.View.extend({
        className: 'forum-quickjump',
        template: _.template(text),
        render: function(context) {

            this.context = $.extend({
                iForumId: 0
            }, context);

            this.$el.html(this.template());

            this.$forum_select_holder = this.$el.find('#forum_select_holder');

            return this;
        },
        inject: function(callback) {

            callback(this.$el);

            this.fetchData();

            return this;
        },
        fetchData: function() {

            utils.api.get('forum/getforumsearch', {}, {
                context: this
            }).done(this.updateView);
        },
        updateView: function(data) {

            if (data.error_code && data.error_code > 0) {
                return utils.modal.alert(data.error_message || _t('Can not load data from server.'));
            }

            this.$forum_select_holder.html(this.getForumSelectHtml(data));
        },
        getForumSelectHtml: function(data) {

            return '<select id="forum_quickjump_select">' + this.addForumOptionHtml(data, '') + '</select>';
        },
        addForumOptionHtml: function(aForums, prefix) {

            var html = '';

            _.each(aForums, function(oForum) {

                html += '<option value="' + oForum.iForumId + '"';

                if (oForum.iForumId == this.context.iForumId) {
                    html += ' selected="selected"'
                }

                html += '>' + prefix + oForum.sName + '</option>';

                // append childs
                html += this.addForumOptionHtml(oForum.aSubForum, prefix + '&nbsp;&nbsp;&nbsp;');

            }, this);

            return html;
        },
        events: {
            'change #forum_quickjump_select': 'quickJump'
        },
        quickJump: function(evt) {

            var $target = $(evt.currentTarget);

            var forum = new Model({
                iForumId: $target.val()
            });

            window.location.href = forum.getUrl();
        }
    });
});