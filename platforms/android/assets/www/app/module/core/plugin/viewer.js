define([
    'user/model/user',
],function(){

    var UserModel = require('user/model/user'),
        storagedViewer  = localStorage.getItem('viewer')
        ;

    if(storagedViewer){

        storagedViewer = JSON.parse(storagedViewer);
    }

    var viewer    = new UserModel(storagedViewer || {});

    viewer.on('change',function(){
        localStorage.setItem('viewer',JSON.stringify(this.toJSON()));
    });

    // when an user go to app not via doLogin function in user/view/login.js, we check local storage to init the viewer
    utils.observer.on('app:init', function() {

        var token  = localStorage.getItem('token');
        var user   = localStorage.getItem('user');


        if(token){
            // validate token

            if(user && utils.validator.isLoggedIn()){
                //user loggedin
                        user   = JSON.parse(user);
                        utils.api.setup({token: token});
                        viewer.set(user);
                        //utils.observer.trigger('user:login', user);
                        constants.token = token;
                        window.location.href  = constants.home;
                       
            }else {

             utils.api.get('user/verify_account',{token: token},{context: this,'async':false})
                .done(function(data){

                    if(data.error_code && data.error_code > 0){

                        //check if user is subscribed
                        if (data.error_code == 1 && data.iPurchaseId){
                            window.location.href = '#subscribe/' + data.iPackageId + '/' + data.iPurchaseId;

                        } else {
                            window.location.href = '#logout';
                        }
                    }else{
 
                        localStorage.setItem('user', JSON.stringify(data)); //cached << Nay
                        // do not changed order of these line.
                        utils.api.setup({token: token});
                        viewer.set(data);
                        utils.observer.trigger('user:login', data);
                        constants.token = token;
                        window.location.href  = constants.home;
                    } 
                })
                .fail(function(){
                    window.location.href = '#logout';
                });

            }
            





        }else{
            window.location.href = '#logout';
        }


        });

        utils.observer.on('user:logout', function(){
            Backbone.iUserId  = 0;
            localStorage.setItem('viewer','');
        })
        .on('user:login', function(){
            Backbone.iUserId = viewer.getId();
        })
        .on('user:update', function(){
            // do something after user update his information.

            utils.api.get('user/verify_account', {
                iUserId: viewer.getId()
            })
                .done(function(data){

                    localStorage.setItem('viewer', JSON.stringify(data));

                    viewer.set(data);

                    utils.debug.log('user updated', data);

                    utils.observer.trigger('viewer:update');

                }).fail(function(){
                    utils.debug.log(arguments);
                });
        });




    return viewer;
});
