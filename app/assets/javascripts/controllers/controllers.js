angular.module('oneListApp').controller('completeController', ['$scope', 'itemsFactory', 'usersFactory', function($scope, itemsFactory, usersFactory) {
  var init = function() {
    // Checking to make sure there is a current user
    if(gon.current_user === '') {
      window.location = '#/login';
    }
    var data = 'This is an ajax request';
    // Fetching all the current user info and lists
    itemsFactory.getCompleteItems(data).success(function(data) {
      // Setting the current item list
      $scope.items = data.items;
      // Setting the current user name
      $scope.username = data.username;
      // Setting the current user email
      $scope.email = data.email;
    });
    // Setting the label message for the switch page button in the options view
    $scope.nextPageTitle = 'Show To Do List';
    // Setting index for use when updating items
    $scope.index = 0;
    // Setting complete attribute to display list items as completed
    $scope.complete = true;
    // Setting the initial view to list view
    $scope.view = 'list';
  };

  init();

  $scope.removeItem = function(i) {
    var data = {
      complete: false,
      item_id: $scope.items[i].id
    };
    // Making a put request to update the 'complete' status of the current item
    itemsFactory.removeItem(data).success(function(data) {});
    // Removing current item from the items list
    $scope.items.splice(i, 1);
    // Updating the keyword list if an item is marked as incomplete
    $scope.createKeywordList();
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
    // Resetting the search term values when done searching or filtering
    if(this.searchTerm) {
      this.searchTerm = '';
    }
    // Resetting the search filter value when done filtering
    if(this.searchFilter) {
      this.searchFilter = '';
    }
  };

  $scope.setFilter = function() {
    // Setting the keyword search filter value to the selected keyword
    this.searchTerm.keywords = this.keyword;
  };

  $scope.createKeywordList = function() {
    // Creating a keyword list for filtering purposes
    var keywordList = [];
    for(var i = 0; i < $scope.items.length; i++) {
      keywordList.push($scope.items[i].keywords);
    }
    $scope.keywordList = _.uniq(_.flatten(keywordList)).sort();
  };

  $scope.changeView = function(view) {
    $scope.labels = [];
    // Changing view to selected view
    $scope.view = view;
    if(view === 'labels') {
      $scope.labels = $scope.getLabels();
    }
  };

  $scope.editUser = function(info) {
    // Initializing(or resetting) the error scope
    $scope.errors = {};
    // Creating a data object based on type of info provided
    if(info === 'name') {
      if(this.username.length < 1) {
        $scope.errors.nameError = 'Sorry, field must be filled in';
      } else {
        var data = { username: this.username };
      }
    } else if(info === 'email') {
      // Checking the format of the entered email address
      var response = checkEmail(this.email);
      if(response.error) {
        $scope.errors.emailError = response.error;
      } else {
        var data = response.data;
      }
    } else {
      // Checking to make sure old password is at least 8 characters long
      if(this.oldPassword === undefined || this.oldPassword.length < 8) {
        $scope.errors.oldPWError = 'Sorry, old password is incorrect.';
      }
      // Checking validations on password
      var response = checkPasswords(this.confirmPassword, this.newPassword, this.oldPassword);
      if(response.errors) {
        $scope.errors.passwordError = response.errors;
      } else {
        var data = response.data;
      }
    }

    if(data) {
      usersFactory.updateUser(data).success(function(data) {
        // Clearing any error messages when an update button is submitted
        $scope.errors = {};
        // Posting error messages to the correct spot if any exist
        if(data.errors) {
          if(data.errors === 'email') {
            $scope.errors.emailError = 'Sorry, email address already in use.';
          } else if(data.errors === 'name') {
            $scope.errors.nameError = 'Sorry, unable to process your request at this time.';
          } else if(data.errors === 'oldPW') {
            $scope.errors.oldPWError = 'Sorry, old password is incorrect.';
          } else {
            $scope.errors.passwordError = [];
            $scope.errors.passwordError.push('Sorry, unable to process your request at this time.');
          }
        // If no errors, updating the current user info based on the update
        } else {
          if(data.username) { $scope.username = data.username };
          if(data.email) { $scope.email = data.email };
        }
      });
    }
  };

  $scope.checkPassword = function() {
    // Clearing error messages
    $scope.errors = {};
    // // Checking to make sure passwords match and length is at least 8 characters long, otherwise an error message is displayed
    var response = checkPasswords(this.confirmPassword, this.newPassword);
    $scope.errors.passwordError = response.errors;
  };

  $scope.checkUsername = function() {
    // Clearing error messages
    $scope.errors = {};
    // Checking to make sure a username was provided
    if(this.username < 1) { $scope.errors.nameError = 'Sorry, you must enter a username.' }
  };

  $scope.checkEmail = function() {
    // Clearing error messages
    $scope.errors = {};
    // Checking to make sure email is formatted correctly
    var response = checkEmail(this.email);
    if(response.error) { $scope.errors.emailError = response.error; }
  };

  $scope.getLabels = function() {
    var labels = [];
    // Getting all the keywords and making a sorted and unique label list
    _.each($scope.items, function(item) {
      labels = _.union(labels, item.keywords);
    });
    return _.sortBy(labels);
  };

  $scope.deleteLabel = function(i) {
    var data = this.label;
    // Making a delete request to delete entered label items
    itemsFactory.deleteLabel(data).success(function(data) {
      var data = 'This is an ajax request';
      // Fetching the new current item list
      itemsFactory.getCompleteItems(data).success(function(data) {
        // Setting the new current item list
        $scope.items = data.items;
        // Setting the labels with updated list
        $scope.labels = $scope.getLabels();
      });
    });
  };

  $scope.clearLabelSearch = function() {
    this.title = '';
  };
}]);



angular.module('oneListApp').controller('incompleteController', ['$scope', 'itemsFactory', 'usersFactory', function($scope, itemsFactory, usersFactory) {
  var init = function() {
    // Checking to make sure there is a current user
    if(gon.current_user === '') {
      window.location = '#/login';
    }
    var data = 'This is an ajax request';
    // Fetching all the current user info and lists
    itemsFactory.getIncompleteItems(data).success(function(data) {
      // Setting the current item list
      $scope.items = data.items;
      // Setting the current user name
      $scope.username = data.username;
      // Setting the current user email
      $scope.email = data.email;
    });
    // Setting the label message for the switch page button in the options view
    $scope.nextPageTitle = 'Show Completed';
    // Setting index for use when updating items
    $scope.index = 0;
    // Setting initial statuses of item attributes to false
    $scope.complete = false;
    $scope.notes = false;
    $scope.due_date = false;
    // Setting the inital view to the list view
    $scope.view = 'list';
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
      complete: true,
      item_id: $scope.items[i].id
    };
    // Making a put request to update the 'complete' status of the current item
    itemsFactory.removeItem(data).success(function(data) {});
    // Removing current item from the items list
    $scope.items.splice(i, 1);
    // Updating the keyword list if an item is marked as completed
    $scope.createKeywordList();
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

  $scope.hideDetails = function() {
    showMain();
  };

  $scope.editTitle = function() {
    var data = {
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

  $scope.addKeywords = function() {
    var data = {
      keywords: this.newKeywords,
      id: this.item.id
    }
    // Clearing the keywords input
    this.newKeywords = '';
    // Making a put request to save the keywords to the item and updating the item.keywords in the current scope
    itemsFactory.updateItem(data).success(function(data) {
      // If the current item has keywords already then the new keywords and ids are added to the array, otherwise the new keywords and ids are set as the item keywords and ids for the current item
      if($scope.items[$scope.index].keywords !== undefined && $scope.items[$scope.index].keywords.length > 0) {
        for(var i = 0; i < data[0].length; i ++) {
          $scope.items[$scope.index].keywords.push(data[0][i]);
          $scope.items[$scope.index].keywordIds.push(data[1][i]);
        }
      } else {
        $scope.items[$scope.index].keywords = data[0];
        $scope.items[$scope.index].keywordIds = data[1];
      }
      // Updating keyword list if a keyword is added
      $scope.createKeywordList();
    });
  };

  $scope.deleteKeyword = function(i) {
    // Grabbing the current keywords and ids for this item
    var keywords = this.item.keywords;
    var keywordIds = this.item.keywordIds;
    // Making a delete request to delete current keyword
    itemsFactory.deleteKeyword(keywordIds[i]).success(function(data) {
      // Removing the keyword and id from the item keywords in current scope
      keywords.splice(i, 1);
      keywordIds.splice(i, 1);
      // Updating keyword list if a keyword is deleted
      $scope.createKeywordList();
    });
  };

  $scope.addNotes = function() {
    var data = {
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

  $scope.deleteItem = function() {
    var data = this.item.id;
    itemsFactory.deleteItem(data).success(function() {
      $scope.items.splice($scope.index, 1);
    });
  }

  $scope.doneSearching = function() {
    // Resetting the search term values when done searching or filtering
    if(this.searchTerm) {
      this.searchTerm = '';
    }
    // Resetting the search filter value when done filtering
    if(this.searchFilter) {
      this.searchFilter = '';
    }
  };

  $scope.setFilter = function() {
    // Setting the keyword search filter value to the selected keyword
    this.searchTerm.keywords = this.keyword;
  };

  $scope.createKeywordList = function() {
    // Creating a keyword list for filtering purposes
    var keywordList = [];
    for(var i = 0; i < $scope.items.length; i++) {
      keywordList.push($scope.items[i].keywords);
    }
    $scope.keywordList = _.uniq(_.flatten(keywordList)).sort();
  };

  $scope.changeView = function(view) {
    $scope.labels = [];
    // Changing view to selected view
    $scope.view = view;
    if(view === 'labels') {
      $scope.labels = $scope.getLabels();
    }
  };

  $scope.editUser = function(info) {
    // Initializing(or resetting) the error scope
    $scope.errors = {};
    // Creating a data object based on type of info provided
    if(info === 'name') {
      if(this.username.length < 1) {
        $scope.errors.nameError = 'Sorry, field must be filled in';
      } else {
        var data = { username: this.username.toLowerCase() };
      }
    } else if(info === 'email') {
      // Checking the format of the entered email address
      var response = checkEmail(this.email);
      if(response.error) {
        $scope.errors.emailError = response.error;
      } else {
        var data = response.data.toLowerCase();
      }
    } else {
      // Checking to make sure old password is at least 8 characters long
      if(this.oldPassword === undefined || this.oldPassword.length < 8) {
        $scope.errors.oldPWError = 'Sorry, old password is incorrect.';
      }
      // Checking validations on password
      var response = checkPasswords(this.confirmPassword, this.newPassword, this.oldPassword);
      if(response.errors) {
        $scope.errors.passwordError = response.errors;
      } else {
        var data = response.data;
      }
    }

    if(data) {
      usersFactory.updateUser(data).success(function(data) {
        // Clearing any error messages when an update button is submitted
        $scope.errors = {};
        // Posting error messages to the correct spot if any exist
        if(data.errors) {
          if(data.errors === 'email') {
            $scope.errors.emailError = 'Sorry, email address already in use.';
          } else if(data.errors === 'name') {
            $scope.errors.nameError = 'Sorry, unable to process your request at this time.';
          } else if(data.errors === 'oldPW') {
            $scope.errors.oldPWError = 'Sorry, old password is incorrect.';
          } else {
            $scope.errors.passwordError = [];
            $scope.errors.passwordError.push('Sorry, unable to process your request at this time.');
          }
        // If no errors, updating the current user info based on the update
        } else {
          if(data.username) { $scope.username = data.username };
          if(data.email) { $scope.email = data.email };
        }
      });
    }
  };

  $scope.checkPassword = function() {
    // Clearing error messages
    $scope.errors = {};
    // // Checking to make sure passwords match and length is at least 8 characters long, otherwise an error message is displayed
    var response = checkPasswords(this.confirmPassword, this.newPassword);
    $scope.errors.passwordError = response.errors;
  };

  $scope.checkUsername = function() {
    // Clearing error messages
    $scope.errors = {};
    // Checking to make sure a username was provided
    if(this.username < 1) { $scope.errors.nameError = 'Sorry, you must enter a username.' }
  };

  $scope.checkEmail = function() {
    // Clearing error messages
    $scope.errors = {};
    // Checking to make sure email is formatted correctly
    var response = checkEmail(this.email);
    if(response.error) { $scope.errors.emailError = response.error; }
  };

  $scope.getLabels = function() {
    var labels = [];
    // Getting all the keywords and making a sorted and unique label list
    _.each($scope.items, function(item) {
      labels = _.union(labels, item.keywords);
    });
    return _.sortBy(labels);
  };

  $scope.deleteLabel = function(i) {
    var data = this.label;
    // Making a delete request to delete entered label items
    itemsFactory.deleteLabel(data).success(function(data) {
      var data = 'This is an ajax request';
      // Fetching the new current item list
      itemsFactory.getIncompleteItems(data).success(function(data) {
        // Setting the new current item list
        $scope.items = data.items;
        // Setting the labels with updated list
        $scope.labels = $scope.getLabels();
      });
    });
  };

  $scope.clearLabelSearch = function() {
    this.title = '';
  };
}]);



angular.module('oneListApp').controller('loginController', ['$scope', 'loginFactory', function($scope, loginFactory) {
  $scope.init = function() {
    $scope.newUser = false;
    $scope.errors = [];
    $scope.user = { email: '', username: '', password: '', password_confirmation: '' };
  }

  $scope.init();

  $scope.changePage = function() {
    $scope.newUser = !$scope.newUser;
    $scope.errors = [];
    $scope.user = { email: '', username: '', password: '', password_confirmation: '' };
  };

  $scope.login = function() {
    $scope.errors = [];
    // Checking email format when logging in
    var email = checkEmail($scope.user.email);
    if(email.error) {
      $scope.errors = ['Invalid email or password.'];
    } else {
      var data = {
        email: $scope.user.email.toLowerCase(),
        password: $scope.user.password,
        remember: $scope.user.remember
      }
    }
    // If email format is correct then login request is made
    if(data) {
      // Making a post request to start a new user session
      loginFactory.login(data).success(function(data) {
        if(data === 'Invalid email or password.') {
          $scope.errors = [data];
        } else {
          // Setting the current user for welcome message
          gon.current_user = data.notice;
          // Directing to the incomplete list view
          window.location = '#/incomplete';
        }
      });
    }
  };

  $scope.signUp = function() {
    $scope.errors = [];
    // Checking password, email, and username for proper formatting
    var password = checkPasswords($scope.user.password_confirmation, $scope.user.password);
    var email = checkEmail($scope.user.email);
    if($scope.user.username.length < 1) { var username = 'Sorry, you must enter a username.' };
    // Displaying errors if they exist
    if(password.errors || email.error || username) {
      var errors = _.flatten([username, email.error, password.errors]);
      $scope.errors = errors;
    // If no errors then user info is prepared for signup
    } else {
      var data = {
        username: $scope.user.username.toLowerCase(),
        email: $scope.user.email.toLowerCase(),
        password: $scope.user.password,
        password_confirmation: $scope.user.password_confirmation
      };
    }

    // If no errors, a post request is made
    if(data) {
      // Making post request to create a new user and start a new user session
      loginFactory.signUp(data).success(function(data) {
        if(data.errors.length > 0) {
          $scope.errors = data.errors;
        } else {
          // Setting the current user for welcome message
          gon.current_user = data.notice;
          // Directing to incomplete list view
          window.location = '#/incomplete';
        }
      }).error(function(data) {
        // Posting any request errors if they exist
        $scope.errors = ['Sorry, we were unable to process your sign up request.'];
      });
    }
  };

  $scope.checkEmail = function() {
    // Clearing error messages
    $scope.errors = {};
    // Checking to make sure email is formatted correctly
    var response = checkEmail(this.user.email);
    if(response.error) { $scope.errors = [response.error]; }
  };
}]);


/****************************/
/*** Controller Functions ***/
/****************************/

var checkPasswords = function(confirmPW, newPW, oldPW) {
  var response = {};
  // Checking to make sure new password matches the confirmed password and is at least 8 characters long
  if(!confirmPW || !newPW) {
    response.errors = ["Passwords don't match.", 'Password must be 8 characters long.'];
  } else if(confirmPW.length < 8 || newPW.length < 8) {
    response.errors = ['Password must be 8 characters long.'];
    if(confirmPW != newPW) {
      response.errors.unshift("Passwords don't match.");
    }
  } else if(confirmPW != newPW) {
    response.errors = ["Passwords don't match."];
  } else {
    if(oldPW) {
      // Preparing password data if all conditions are met
      response.data = { new_password: newPW, old_password: oldPW };
    }
  }
  return response;
};

var checkEmail = function(email) {
  // Checking the format of the entered email
  var response = {};
  if(email.match(/.+\@[a-zA-z0-9]+\.[a-zA-Z]{2,3}$/) && !email.trim().match(/\s/)) {
    response.data = { email: email };
  } else {
    response.error = 'Sorry, invalid email.';
  }

  return response;
};

