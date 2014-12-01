define(function() {

    var Model = Backbone.Model.extend({

    });


    Model.prototype.getId = function() {
        return this.get('iMessageId');
    }

    Model.prototype.getConversationId = function() {
        return this.get('iConversationId');
    }

    Model.prototype.getTitle = function() {
        return this.get('iConversationTitle');
    }

    Model.prototype.getUrl = function() {
        return '#message/' + this.getId();
    }

    Model.prototype.getPosterTitle = function() {
        return this.get('sFullName');
    }

    Model.prototype.getPosterImageSrc = function() {
        return this.get('sImage');
    }

    Model.prototype.getContent = function() {

        var sBody = this.get('sBody') || '';

        return utils.helper.parseExternalLink(sBody);
    }

    Model.prototype.getPostedDate = function() {
        return this.get('sTimeConverted');
    }
    Model.prototype.getPosterId = function() {
        return this.get('iUserId');
    }

    Model.prototype.getPosterUrl = function() {
        return '#user/' + this.getPosterId();
    }

    return Model;
});