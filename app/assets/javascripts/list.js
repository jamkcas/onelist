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
    .otherwise({ redirectTo: '/incomplete' });
});

app.controller('completeController', function($scope) {
  $scope.items = [
    { title: 'shop', note: 'buy groceries' },
    { title: 'job', note: 'look for job' },
    { title: 'clean', note: 'clean house' }
  ];
});

app.controller('incompleteController', function($scope) {
  $scope.items = [
    { title: 'eat', note: 'eat breakfast' },
    { title: 'cats', note: 'feed cats' },
    { title: 'dog', note: 'feed dog' }
  ];

  $scope.addItem = function() {
    $scope.items.push({ title: $scope.newItem.title, note: $scope.newItem.note });
    console.log($scope.items)
  }
});