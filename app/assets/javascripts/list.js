var app = angular.module('oneListApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/complete',
    {
      controller: 'listController',
      templateUrl: 'templates/complete_list.html'
    })
    .when('/incomplete',
    {
      controller: 'listController',
      templateUrl: 'templates/incomplete_list.html'
    })
    .otherwise({ redirectTo: '/complete' });
});

app.controller('listController', function($scope) {
  $scope.items = [
    { title: 'shop', note: 'buy groceries' },
    { title: 'job', note: 'look for job' },
    { title: 'clean', note: 'clean house' }
  ];
});