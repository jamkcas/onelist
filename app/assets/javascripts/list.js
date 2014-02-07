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

/*************************/
/*** Module and Config ***/
/*************************/

var app = angular.module('oneListApp', ['ngRoute', 'ngAnimate']);

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
    $scope.message = 'Welcome, ' + gon.current_user;
    itemsFactory.getCompleteItems().success(function(data) {
      $scope.items = data;
    });
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
    var title = $scope.newItem.title;

    itemsFactory.saveItem(title).success(function(data) {
      $scope.items.unshift(data.item);
      $scope.newItem.title = '';
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

/*****************/
/*** Factories ***/
/*****************/

app.factory('itemsFactory', function($http) {
  var factory = {};

  factory.getIncompleteItems = function() {
    return $http.get('/getIncomplete.json');
  };

  factory.getCompleteItems = function() {
    return $http.get('/getComplete.json');
  };

  factory.saveItem = function(title) {
    return $http.post('/saveItem', { title: title });
  };

  factory.removeItem = function(data) {
    return $http.put('/changeStatus', { data: data });
  }

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
  };

  return service;
});

/******************/
/*** Directives ***/
/******************/

app.directive('removeItem', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      var listItem = $(this).parent().parent();
      listItem.animate({ 'left': listItem.width() }, { 'complete': function() {
          listItem.animate({ 'height': '0' }, { 'complete': function() {
              scope.$apply(attrs.removeItem);
            }
          });
        }
      });
    });
  }
});

app.directive('showOptions', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Defining the value to set the width of the options to and animate the main and options views to and from
      var left = calculateOptionsWidth();
      // Setting the height of the options window based on the greater of the heights between the main view and the window
      setOptionsHeight();
      // Animating main and options view depending on which one is being displayed
      if($('.mainView').css('left') === '0px') {
        $('.optionsView').css('left', -left);
        $('.optionsView').css('width', left);
        $('.mainView').animate({ 'left': left });
        $('.optionsView').animate({ 'left': '0' });
      } else {
        $('.mainView').animate({ 'left': '0' });
        $('.optionsView').animate({ 'left': -left });
      }
    });
  }
});

app.directive('changePage', function() {
  return {
    scope: {},
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        var width = calculateOptionsWidth();
        $('.mainView').animate({ 'left': '0' });
        $('.optionsView').animate({ 'left': -width }, {'complete': function() {
            window.location = attrs.changePage;
          }
        });
      });
    }
  }
});

/***************/
/*** Filters ***/
/***************/


/***************/
/*** On Load ***/
/***************/

$(function() {
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