/*************************/
/*** Utility Functions ***/
/*************************/

var defineLeft = function() {
  return (-(parseInt($('.container').css('margin-left').match(/[0-9]+/)[0]) + 300)).toString() + 'px';
};

// Function to set element height to either the mainView height or the window height depending which is bigger
var setHeight = function(elem) {
  // Changing the height if the window or main view height is greater than the elements height{
  if($('.mainView').height() > $(window).height()) {
    elem.css('height', $('.mainView').height());
  } else {
    elem.css('height', $(window).height());
  }
};

// Function to calculate width for details or options views
var calculateWidth = function(pct) {
  return $('.mainView').width() * pct;
};

// Getting and formatting current date
var getCurrentDate = function() {
  var today = new Date();
  var date = {};
  date.day = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
  date.time = today.getHours() + ':' + ("0" + today.getMinutes()).slice(-2);
  return date;
};

// Formatting military time to normal time
var formatTime = function(time) {
  var hours = time.slice(0, 2);
  var minutes = time.slice(3);
  if(hours > 12) {
    hours -= 12;
    var am_pm = 'PM';
  } else {
    var am_pm = 'AM'
  }

  var time = hours + ':' + minutes + am_pm;
  return time;
};

// Formatting normal time to military time
var toMilitary = function(time) {
  if(time.slice(-2) === 'PM') {
    var hours = parseInt(time.slice(0, 2)) + 12;
    var mins = time.slice(-4).slice(0,2);
    var date = hours + ':' + mins;
  } else {
    var date = time;
  }
  return date;
};



/*************************/
/*** Module and Config ***/
/*************************/

var app = angular.module('oneListApp', ['ngRoute', 'ngAnimate', 'ngTouch']);

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
    .when('/login',
    {
      controller: 'loginController',
      templateUrl: 'templates/login.html'
    })
    .otherwise({ redirectTo: '/incomplete' });
});

// Configuration to deal with csrf-token
app.config(["$httpProvider", function($httpProvider) {
  var token = $('meta[name=csrf-token]').attr('content');
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = token;
}]);

/***************/
/*** On Load ***/
/***************/

// For removing the address bar
window.addEventListener("load",function() {
 setTimeout(function(){
    window.scrollTo(0, 0);
    }, 0);
});

$(function() {
  // Making sure the container covers at least the height of the window
  setHeight($('.container'));

  // On resize,
  window.onresize = function() {
    // Making sure the container covers at least the height of the window
    setHeight($('.container'));
    // Setting the height of the options and details views when window is resized
    setHeight($('.optionsView'));
    setHeight($('.detailsView'));
    // Resetting the main and option views if window is resized > 768px
    if($(window).width() > 768) {
      $('.mainView').css('left', '0px');
      $('.optionsView').css('left', -($('.optionsView').width()));
    }
    // Adjusting the options width based on the main view width if options are being displayed
    if($('.mainView').css('left') != '0px') {
      $('.optionsView').css('width', calculateWidth(0.8));
      $('.mainView').css('left', calculateWidth(0.8));
    }
    // Adjusting the details width based on the main view width if details are being displayed
    if($('.detailsView').css('right') === '0px') {
      $('.detailsView').css('width', calculateWidth(0.95));
    }
  };
});