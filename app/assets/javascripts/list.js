/*************************/
/*** Utility Functions ***/
/*************************/

var defineLeft = function() {
  return (-(parseInt($('.container').css('margin-left').match(/[0-9]+/)[0]) + 300)).toString() + 'px';
};

// Function to set element height to either the mainView height or the window height depending which is bigger
var setHeight = function(elem) {
  if($(window).height() > $('.mainView').height()) {
    var height = $(window).height();
  } else {
    var height = $('.mainView').height();
  }
  // Changing the height if the window or main view height is greater than the elements height
  if(height > elem.height()) {
    elem.css('height', height);
  }
};

// Function to calculate width for details or options views
var calculateWidth = function(pct) {
  return $('.mainView').width() * pct;
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

window.addEventListener("load",function() {
 setTimeout(function(){
    window.scrollTo(0, 0);
    }, 0);
});

$(function() {
  // // Redirects to login page if no one is logged in (mainly for when refreshing the page after signing in)
  // if(gon.current_user === '') {
  //   window.location.replace('#/login');
  // }
  $.mobile.ignoreContentEnabled = true;
  $.mobile.defaultPageTransition = 'slide';
  // Making sure the container covers at least the height of the window
  $('.container').css('min-height', $(window).height());

  // On resize,
  window.onresize = function() {
    // Making sure the container covers at least the height of the window
    $('.container').css('min-height', $(window).height());
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