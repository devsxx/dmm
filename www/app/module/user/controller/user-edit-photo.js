define([
    'user/model/user',
    'user/view/edit-user-photo'
], function(UserModel, EditView) {

    function editController(id, imageuri) {

        // utils.history.push();

        utils.observer.trigger('router:changed');

        new EditView({
            model: new UserModel({
                iUserId: id
            })
        }).render({
            imageURI: atob(imageuri)
        }).inject();
    }

    utils.router.route('user-edit-photo/:id/:imageuri', editController);

});