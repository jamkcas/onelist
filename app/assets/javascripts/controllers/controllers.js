angular.module('oneListApp').controller('completeController', function($scope, itemsFactory) {
  var init = function() {
    $scope.message = 'Welcome, ' + gon.current_user;

    itemsFactory.getCompleteItems().success(function(data) {
      $scope.items = data;
    });

    $scope.nextPageTitle = 'Show To Do List';
    $scope.index = 0;
  };

  init();

  $scope.deleteItem = function(i) {
    var data = {
      heading: 'ajax request',
      complete: false,
      item_id: $scope.items[i].id
    };

    itemsFactory.removeItem(data).success(function(data) {});

    $scope.items.splice(i, 1);
  };

  $scope.getItem = function(i) {
    $scope.index = i;
    var header = 'ajax request';
    var id = $scope.items[i].id;
    itemsFactory.getItem(header, id).success(function(data) {
      $scope.item = data;
    });
  };

  $scope.editTitle = function() {
    var data = {
      header: 'ajax request',
      title: this.item.title,
      id: this.item.id
    };
    var title = this.item.title;

    itemsFactory.updateItem(data).success(function(data) {
      $scope.items[$scope.index].title = title;
    });
  };

  $scope.changePage = function() {
    window.location = '#/incomplete';
  };
});

angular.module('oneListApp').controller('incompleteController', function($scope, itemsFactory, sharedAttributesService) {
  var init = function() {
    $scope.message = 'Welcome, ' + gon.current_user;

    itemsFactory.getIncompleteItems().success(function(data) {
      $scope.items = data;
    });

    $scope.nextPageTitle = 'Show Completed';
    $scope.index = 0;
  };

  init();

  $scope.addItem = function() {
    var title = this.newItem;

    itemsFactory.saveItem(title).success(function(data) {
      $scope.items.unshift(data.item);
      this.newItem = '';
    });
  };

  $scope.deleteItem = function(i) {
    var data = {
      heading: 'ajax request',
      complete: true,
      item_id: $scope.items[i].id
    };

    itemsFactory.removeItem(data).success(function(data) {});

    $scope.items.splice(i, 1);
  };

  $scope.getItem = function(i) {
    $scope.index = i;
    var header = 'ajax request';
    var id = $scope.items[i].id;
    itemsFactory.getItem(header, id).success(function(data) {
      $scope.item = data;
    });
  };

  $scope.editTitle = function() {
    var data = {
      header: 'ajax request',
      title: this.item.title,
      id: this.item.id
    };
    var title = this.item.title;

    itemsFactory.updateItem(data).success(function(data) {
      $scope.items[$scope.index].title = title;
    });
  };

  $scope.changePage = function() {
    window.location = '#/complete';
  };
});

angular.module('oneListApp').controller('loginController', function($scope, loginFactory, sharedAttributesService) {
  $scope.login = function() {
    var data = {
      email: $scope.user.email,
      password: $scope.user.password,
      remember: $scope.user.remember
    }

    loginFactory.login(data).success(function(data) {
      if(data === 'Invalid email or password.') {
        var errors = document.getElementById('loginErrors');
        errors.innerHTML = '';
        postErrors(errors, data);
      } else {
        gon.current_user = data;
        window.location = '#/incomplete';
      }
    });
  };

  $scope.signUp = function() {
    var data = {
      username: $scope.user.username,
      email: $scope.user.email,
      password: $scope.user.password,
      password_confirmation: $scope.user.password_confirmation
    };

    loginFactory.signUp(data).success(function(data) {
      var errors = document.getElementById('signupErrors');
      errors.innerHTML = '';
      if(data.errors.length > 0) {
        for(var i = 0; i < data.errors.length; i++) {
          postErrors(errors, data.errors[i]);
        }
      } else {
        gon.current_user = data.notice;
        window.location = '#/incomplete';
      }
    }).error(function(data) {
      var message = 'Sorry, we were unable to process your sign up request.';
      postErrors(errors, errorMessage);
    });
  };
});
