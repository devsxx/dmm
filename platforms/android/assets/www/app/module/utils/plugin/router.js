define(function(){
	
	var Router  = Backbone.Router.extend({
		//we need to implement silent routing on some pages.  << Nay 
		constructor: function (options){
      				console.log("router initializing...");
      				this.on("all", this.storeRoute);
      				this.session = [];
		},
		storeRoute: function (){
			if(this.session.length > 0){

					 var lastRoute = this.session[this.session.length - 1];
					 console.log(lastRoute);
					  if(lastRoute != Backbone.history.fragment){ // looks like we made duplicates somewhere - dirty fix :D << Nay 
					      console.log("route history added!");
					  	return this.session.push(Backbone.history.fragment);
					  } 
			}else {
				  console.log("first route history added!");
				  console.log(Backbone.history.fragment)
				 return this.session.push(Backbone.history.fragment);
			}
			
		},
		previous: function () {
			if (this.session.length > 1) {
				console.log("can go back!");
				console.log(this.session);
				console.log(this.session[this.session.length - 2]);
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

