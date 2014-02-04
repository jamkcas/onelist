var postErrors = function(elem, msg) {
  var error = document.createElement('li');
  error.className = 'col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12';
  var errorMessage = document.createTextNode(msg);
  error.appendChild(errorMessage);
  elem.appendChild(error);
};

var defineLeft = function() {
  return (-(parseInt($('.container').css('margin-left').match(/[0-9]+/)[0]) + 300)).toString() + 'px';
};

var setOptionsHeight = function() {
  if($(window).height() > $('.mainView').height()) {
    var height = $(window).height();
  } else {
    var height = $('.mainView').height();
  }
  $('.optionsView').css('height', height);
};

var calculateOptionsWidth = function() {
  return $(window).width() * 0.8;
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
    .otherwise({ redirectTo: '/login' });
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
    itemsFactory.getCompleteItems().success(function(data) {
      $scope.items = data;
    });
  }

  init();
});

app.controller('incompleteController', function($scope, itemsFactory, sharedAttributesService) {
  var init = function() {
    $scope.message = 'Welcome, ' + gon.current_user;
    itemsFactory.getIncompleteItems().success(function(data) {
      $scope.items = data;
    });
  };

  init();

  $scope.addItem = function() {
    $scope.items.push({ title: $scope.newItem.title });
    $scope.newItem.title = '';
  }
});

app.controller('loginController', function($scope, loginFactory, sharedAttributesService) {
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
    }

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
  }
});

/*****************/
/*** Factories ***/
/*****************/

app.factory('itemsFactory', function($http) {
  var factory = {};

  factory.getIncompleteItems = function() {
    return $http.get('/items.json');
  };

  factory.getCompleteItems = function() {
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
    return $http.post('/sessions', { user: data });
  };

  return factory;
});

/****************/
/*** Services ***/
/****************/

app.service('sharedAttributesService', function() {
  var service = {};

  service.setMessage = function(msg) {
    return service.message = msg;
  }

  return service;
});


/***************/
/*** On Load ***/
/***************/

$(function() {
  setEvents();
  // Redirects to login page if no one is logged in (mainly for when refreshing the page after signing in)
  if(gon.current_user === '') {
    window.location.replace('#/login');
  }

  // Making sure the container covers at least the height of the window
  $('.container').css('min-height', $(window).height());
  // On resize,
  window.onresize = function() {
    // Making sure the container covers at least the height of the window
    $('.container').css('min-height', $(window).height());
    // Setting the height of the options view when window is resized
    setOptionsHeight();
    // Resetting the main and option views if window is resized > 768px
    if($(window).width() > 768) {
      $('.mainView').css('left', '0px');
      $('.optionsView').css('left', -($('.optionsView').width()));
    }
    // Adjusting the options width based on the window width if options are being displayed
    if($('.mainView').css('left') != '0px') {
      $('.optionsView').css('width', calculateOptionsWidth());
      $('.mainView').css('left', calculateOptionsWidth());
    }
  };
});