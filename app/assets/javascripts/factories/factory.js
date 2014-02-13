angular.module('oneListApp').factory('itemsFactory', function($http) {
  var factory = {};

  factory.getIncompleteItems = function(data) {
    return $http.get('/getIncomplete/' + data + '.json');
  };

  factory.getCompleteItems = function(data) {
    return $http.get('/getComplete/' + data + '.json');
  };

  factory.saveItem = function(title) {
    return $http.post('/saveItem', { title: title });
  };

  factory.removeItem = function(data) {
    return $http.put('/changeStatus', { data: data });
  };

  factory.updateItem = function(data) {
    return $http.put('/updateItem', { data: data });
  };

  factory.deleteItem = function(data) {
    return $http.delete('/deleteItem/' + data);
  };

  factory.deleteKeyword = function(data) {
    return $http.delete('/deleteKeyword/' + data);
  };

  factory.deleteLabel = function(data) {
    return $http.delete('/deleteLabel/' + data);
  };

  return factory;
});

angular.module('oneListApp').factory('loginFactory', function($http) {
  var factory = {};

  factory.signUp = function(data) {
    return $http.post('/users', { user: data });
  };

  factory.login = function(data) {
    return $http.post('/sessions', { user: data });
  };

  return factory;
});

angular.module('oneListApp').factory('usersFactory', function($http) {
  var factory = {};

  factory.updateUser = function(data) {
    return $http.put('/updateUser', { data: data });
  };

  return factory;
});

