define(function(){
	
	var Router  = Backbone.Router.extend({
		//we need to implement silent routing on some pages.  << Nay 
		constructor: function (options){

      				this.on("all", this.storeRoute);
      				this.session = [];
		},
		storeRoute: function (){
			if(this.session.length > 0){

					 var lastRoute = this.session[this.session.length - 1];

					  if(lastRoute != Backbone.history.fragment){ // looks like we made duplicates somewhere - dirty fix :D << Nay 

					  	return this.session.push(Backbone.history.fragment);
					  } 
			}else {

				 return this.session.push(Backbone.history.fragment);
			}
			
		},
		previous: function () {
			if (this.session.length > 1) {

		        return this.navigate(this.session[this.session.length - 2], false);
		      }
		},
		// array unique values << Nay 
        onlyUnique: function (value, index, self) { 
                return self.indexOf(value) === index;
        },
        getUniqueRoutes: function (){
        	    return this.session.filter( this.onlyUnique );
        }
	});
		
	
	return new Router;
});

