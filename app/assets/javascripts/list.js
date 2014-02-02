var postErrors = function(elem, msg) {
  var error = document.createElement('li');
  var errorMessage = document.createTextNode(msg);
  error.appendChild(errorMessage);
  elem.appendChild(error);
};

var app = angular.module('oneListApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/complete',
    {
      controller: 'completeController',
      templateUrl: 'templates/complete_list.html'
    })
    .when('/incomplete',
    {
      controller: 'incompleteController',
      templateUrl: 'templates/incomplete_list.html'
    })
    .when('/signup',
    {
      controller: 'loginController',
      templateUrl: 'templates/signup.html'
    })
    .when('/login',
    {
      controller: 'loginController',
      templateUrl: 'templates/login.html'
    })
    .otherwise({ redirectTo: '/incomplete' });
});

app.config(["$httpProvider", function($httpProvider) {
  var token = $('meta[name=csrf-token]').attr('content');
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = token;
}]);

/*******************/
/*** Controllers ***/
/*******************/

app.controller('completeController', function($scope, itemsFactory) {
  var init = function() {
    itemsFactory.getItems().success(function(data) {
      $scope.items = data;
    });
  }

  init();
});

app.controller('incompleteController', function($scope, itemsFactory, sharedAttributesService) {
  var init = function() {
    itemsFactory.getItems().success(function(data) {
      $scope.items = data;
    });
  };

  init();

  $scope.message = sharedAttributesService.message;
});

app.controller('loginController', function($scope, loginFactory, sharedAttributesService) {
  $scope.login = function() {
    var data = {
      email: $scope.user.email,
      password: $scope.user.password
    }
    loginFactory.login(data).success(function(data) {

    });
  };

  $scope.signUp = function() {
    var data = {
      username: $scope.user.username,
      email: $scope.user.email,
      password: $scope.user.password,
      password_confirmation: $scope.user.password_confirmation
    }

    loginFactory.signUp(data).success(function(data) {
      var errors = document.getElementById('signUpErrors');
      errors.innerHTML = '';
      if(data.errors.length > 0) {
        for(var i = 0; i < data.errors.length; i++) {
          postErrors(errors, data.errors[i]);
        }
      } else {
        window.location = '#/incomplete';
        sharedAttributesService.setMessage(data.notice);
      }
    }).error(function(data) {
      var message = 'Sorry, we were unable to process your sign up request.';
      postErrors(errors, errorMessage);
    });
  }
});

/*****************/
/*** Factories ***/
/*****************/

app.factory('itemsFactory', function($http) {
  var factory = {};

  factory.getItems = function() {
    return $http.get('/items.json');
  };

  return factory;
});

app.factory('loginFactory', function($http) {
  var factory = {};

  factory.signUp = function(data) {
    return $http.post('/users', { user: data });
  };

  factory.login = function(data) {
    return $http.post('/users', { user: data });
  };

  return factory;
});

app.service('sharedAttributesService', function() {
  var service = {};

  service.setMessage = function(msg) {
    return service.message = msg;
  }

  return service;
});