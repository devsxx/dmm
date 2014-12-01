define(['comet/model/chat'], function() {
	var ChatModel = require('comet/model/chat');

	function getChatStatusSortOrderValue(status) {
		switch(status) {
			case 'available':
				return 1;
            case 'busy':
                return 1;
            case 'away':
				return 1;
			case 'invisible':
				return 0;
			case 'offline':
				return 0;
		}
		return 0;
	}

	var ChatCollection = Backbone.Collection.extend({
		model : ChatModel,
		// comparator: function(item) {
		//     return -item.getLastMessageTimestamp();
		// },
		comparator : function(first, second) {
			var rs

			rs = this.compareLastTimestamp(first, second);
			if (rs !== 0)
				return rs;

			rs = this.compareStatus(first, second);
			if (rs !== 0)
				return rs;

			rs = this.compareName(first, second);
			if (rs !== 0)
				return rs;

			return 0;

		},
		compareLastTimestamp : function(first, second) {
			if (first.getLastMessageTimestamp() > second.getLastMessageTimestamp()) {
				return -1;
			} else {
				if (first.getLastMessageTimestamp() == second.getLastMessageTimestamp()) {
					return 0;
				} else {
					return 1;
				}
			}
		},

		compareStatus : function(first, second) {
			if (first.getStatus() !== second.getStatus()) {
				
				var v1 = getChatStatusSortOrderValue(first.getStatus());
				var v2 = getChatStatusSortOrderValue(second.getStatus());

				if (v1 > v2) {
					return -1;
				} else if(v1 < v2){
					return 1;
				}
			}
			return 0;
		},

		clearCurrentStatus : function() {
			_.each(this.models, function(item) {
				item.set('bIsCurrent', false);
			}, this);
		},
		compareName : function(first, second) {
			if (first.getName() > second.getName()) {
				return 1;
			} else {
				return -1;
			}

		},
		isStillUpdate : false
	});

	return ChatCollection;
});

