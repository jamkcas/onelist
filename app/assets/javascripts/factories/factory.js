angular.module('oneListApp').factory('itemsFactory', function($http) {
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

  factory.getItem = function(header, id) {
    return $http.get('/getItem/' + header + '/' + id);
  }

  factory.updateItem = function(data) {
    return $http.put('/updateItem', { data: data })
  }

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

app.factory('sharedAttributesService', function() {
  var factory = {};

  factory.setMessage = function(msg) {
    return factory.message = msg;
  };

  return factory;
});