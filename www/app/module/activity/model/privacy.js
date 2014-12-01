define([
], function() { 
    var Privacy = Backbone.Model.extend({
        idAttribute: 'sValue',
        defaults: {
            isChosen: false,
        }
    });

    Privacy.prototype.getClass = function() {
        var prefix = 'icon-privacy-';
        var type = '';
        switch(this.getValue()) {
            case 0: 
                type = 'everyone';
                break;
            case 1: 
                type = 'friends';
                break;
            case 2: 
                type = 'friends-of-friends';
                break;
            case 3: 
                type = 'only-me';
                break;
            case 4: 
                type = 'custom';
                break;
        }

        return prefix + type;
    }

    Privacy.prototype.getValue = function() {
        return parseInt(this.get('sValue'), 10) || 0;
    }

    Privacy.prototype.getPhrase = function() {
        return this.get('sPhrase') || '';
    }

    Privacy.prototype.isChosen = function() {
        return this.get('isChosen') || false;
    }

    return Privacy;
});


