angular.module('oneListApp').controller('completeController', function($scope, itemsFactory) {
  var init = function() {
    // Setting the welcome message based on current user
    $scope.message = 'Welcome, ' + gon.current_user;
    // Fetching all the completed items
    itemsFactory.getCompleteItems().success(function(data) {
      $scope.items = data;
    });
    // Setting the label message for the switch page button in the options view
    $scope.nextPageTitle = 'Show To Do List';
    // Setting index for use when updating items
    $scope.index = 0;

    $scope.complete = true;
  };

  init();

  $scope.removeItem = function(i) {
    var data = {
      heading: 'ajax request',
      complete: false,
      item_id: $scope.items[i].id
    };
    // Making a put request to update the 'complete' status of the current item
    itemsFactory.removeItem(data).success(function(data) {});
    // Removing current item from the items list
    $scope.items.splice(i, 1);
  };

  $scope.getItem = function(i) {
    // Setting the index for use in the details view
    $scope.index = i;
    // Setting the item scope to the current item
    $scope.item = $scope.items[i]
  };

  $scope.changePage = function() {
    window.location = '#/incomplete';
  };

  $scope.doneSearching = function() {
    // Restting the searchTerm when done searching
    if(this.searchTerm) {
      this.searchTerm.title = '';
      this.searchTerm.keywordList = '';
    }
  };
});



angular.module('oneListApp').controller('incompleteController', function($scope, itemsFactory, sharedAttributesFactory) {
  var init = function() {
    // Setting the welcome message based on current user
    $scope.message = 'Welcome, ' + gon.current_user;
    // Fetching all the completed items
    itemsFactory.getIncompleteItems().success(function(data) {
      $scope.items = data;
    });
    // Setting the label message for the switch page button in the options view
    $scope.nextPageTitle = 'Show Completed';
    // Setting index for use when updating items
    $scope.index = 0;
    // Setting initial statuses of item attributes to false
    $scope.complete = false;
    $scope.notes = false;
    $scope.due_date = false;
  };

  init();

  $scope.addItem = function() {
    var title = this.newItem;
    // Resetting newItem attribute on the current scope
    this.newItem = '';
    // Checking to see if there is a value in the newItem field, and saving the new item if so
    if(title !== undefined && title !== '') {
      // Making a post request to save a new item
      itemsFactory.saveItem(title).success(function(data) {
        // Adding the item to the beginning of the items list in current scope
        $scope.items.unshift(data.item);
        // Clearing the new item input
        $('.newItem').val('');
      });
    }
  };

  $scope.removeItem = function(i) {
    var data = {
      heading: 'ajax request',
      complete: true,
      item_id: $scope.items[i].id
    };
    // Making a put request to update the 'complete' status of the current item
    itemsFactory.removeItem(data).success(function(data) {});
    // Removing current item from the items list
    $scope.items.splice(i, 1);
  };

  $scope.getItem = function(i) {
    // Setting the index for use in the details view
    $scope.index = i;
    // Setting the item scope to the current item
    $scope.item = $scope.items[i];

    $scope.notes = $scope.item.notes ? true : false;
    $scope.due_date = $scope.item.due_date ? true : false;
  };

  $scope.clearScope = function() {
    $scope.item = '';
  };

  $scope.editTitle = function() {
    var data = {
      header: 'ajax request',
      title: this.item.title,
      id: this.item.id
    };
    var title = this.item.title;
    // Making put request to update the current item's title with the new title
    itemsFactory.updateItem(data).success(function(data) {
      // Updating the title in the items array of the current scope
      $scope.items[$scope.index].title = title;
    });
  };

  $scope.changePage = function() {
    window.location = '#/complete';
  };

  $scope.setKeywordList = function() {
    // Going through all the keywords for the current item and creating a string to use in tag filtering
    var tags = [];
    for(var keyword in $scope.items[$scope.index].keywords) {
      tags.push($scope.items[$scope.index].keywords[keyword].name);
    }
    $scope.items[$scope.index].keywordList = tags.join(', ');
  };

  $scope.addKeywords = function() {
    var data = {
      header: 'ajax request',
      keywords: this.newKeywords,
      id: this.item.id
    }
    // Clearing the keywords input
    this.newKeywords = '';
    // Making a put request to save the keywords to the item and updating the item.keywords in the current scope
    itemsFactory.updateItem(data).success(function(data) {
      // If the current item has keywords already then the new keywords are added to the array, otherwise the new keywords are set ad the item.keywords for the current item
      // console.log()
      if($scope.items[$scope.index].keywords !== undefined && $scope.items[$scope.index].keywords.length > 0) {
        for(var i = 0; i < data.length; i ++) {
          $scope.items[$scope.index].keywords.push(data[i]);
        }
      } else {
        $scope.items[$scope.index].keywords = data;
      }
      // Setting the keywordList for tag filtering
      $scope.setKeywordList();
    });
  }

  $scope.deleteKeyword = function(i) {
    var keyword = this.item.keywords[i].id
    // Grabbing the current keywords for this item
    var keywords = this.item.keywords;
    // Making a delete request to delete current keyword
    itemsFactory.deleteKeyword(keyword).success(function(data) {
      // Removing the keyword from the item keywords in current scope
      keywords.splice(i, 1);
      // Setting the keyword list for tag filtering
      $scope.setKeywordList();
    });
  };

  $scope.addNotes = function() {
    var data = {
      header: 'ajax request',
      note: this.item.notes,
      id: this.item.id
    }
    // Making a put request to save notes for the current item
    itemsFactory.updateItem(data).success(function(data) {
      // Putting the notes input field background to its original state
      revertBackground();
    });
  };

  $scope.addDatetime = function() {
    // Creating a new formatted datetime object with the inputted time and date
    var time = new Date(this.item.date + ' ' + this.item.time).toLocaleString();
    // Checking to see if a valid date is enetered
    if(time.toString() !== 'Invalid Date') {
      var data = {
        due_date: time,
        id: this.item.id
      };
      // Making a put request to save due date for current item
      itemsFactory.updateItem(data).success(function(data) {
        // Setting the current item's due date attribute on the current scope
        $scope.items[$scope.index].due_date = time;
        // Setting the due date scope to true for the current item
        $scope.due_date = true;
      });
    }
  };

  $scope.doneSearching = function() {
    // Restting the searchTerm when done searching
    if(this.searchTerm) {
      this.searchTerm.title = '';
      this.searchTerm.keywordList = '';
    }
  };
});



angular.module('oneListApp').controller('loginController', function($scope, loginFactory) {
  $scope.login = function() {
    var data = {
      email: $scope.user.email,
      password: $scope.user.password,
      remember: $scope.user.remember
    }
    // Making a post request to start a new user session
    loginFactory.login(data).success(function(data) {
      if(data === 'Invalid email or password.') {
        // Displaying errors if they exist
        var errors = document.getElementById('loginErrors');
        errors.innerHTML = '';
        postErrors(errors, data);
      } else {
        // Setting the current user for welcome message
        gon.current_user = data;
        // Directing to the incomplete list view
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
    // Making post request to create a new user and start a new user session
    loginFactory.signUp(data).success(function(data) {
      var errors = document.getElementById('signupErrors');
      errors.innerHTML = '';
      // Posting errors if any exist
      if(data.errors.length > 0) {
        for(var i = 0; i < data.errors.length; i++) {
          postErrors(errors, data.errors[i]);
        }
      } else {
        // Setting the current user for welcome message
        gon.current_user = data.notice;
        // Directing to incomplete list view
        window.location = '#/incomplete';
      }
    }).error(function(data) {
      // Posting any request errors if they exist
      var message = 'Sorry, we were unable to process your sign up request.';
      postErrors(errors, errorMessage);
    });
  };
});
