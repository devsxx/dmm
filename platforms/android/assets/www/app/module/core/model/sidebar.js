define(function(){
	return Backbone.Model.extend({
		idAttribute: 'sName',
		defaults: {},
		getLabel: function(){
			return this.get('sLabel');
		},
		getModuleId: function(){
			return this.get('sLayout');
		},
		toHtml: function(module, config){
			
			if(!config){return ''};
			
			var id  = this.getModuleId();
			var active  = id == module?'active':'';
			
			return '<div class="item '+active+'" data-href="'+config.url +'" data-id="'+id+'"><i class="sidebar-icon '+config.icon+'"></i> <span>'+ _t(this.getLabel()) +'</span></div>';
		}
	});
});
