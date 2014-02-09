angular.module('oneListApp').directive('removeItem', function() {
  return function(scope, element, attrs) {
    // When remove item is clicked the list item animates off the page, collapses then is removed from the scope
    element.bind('click', function(event) {
      // Preventing the show details event from firing
      event.stopImmediatePropagation();
      // Grabbing the current list item to animate
      var listItem = $(this).parent().parent();
      // Moving the list item off the page
      listItem.animate({ 'left': listItem.width() }, { 'complete': function() {
          // After the item moves off the page, the list item collapses
          listItem.animate({ 'height': '0' }, { 'complete': function() {
              // Invoking the removeItem function on the current scope to remove the item from the current scope
              scope.$apply(attrs.removeItem);
            }
          });
        }
      });
    });
  }
});

angular.module('oneListApp').directive('showOptions', function() {
  return function(scope, element, attrs) {
    // When options hamburger button is clicked, the options view show
    element.bind('click', function() {
      // Displaying the overlay
      toggleOverlay();
      // Defining the value to set the width of the options to and animate the main and options views to and from
      var width = calculateWidth(0.8);
      // Setting the height of the options window based on the greater of the heights between the main view and the window
      setHeight($('.optionsView'));
      // Animating options view
      $('.optionsView').css('left', -width);
      $('.optionsView').css('width', width);
      $('.mainView').animate({ 'left': width });
      $('.optionsView').animate({ 'left': '0' });
    });
  }
});

angular.module('oneListApp').directive('showDetails', function() {
  return function(scope, element, attrs) {
    // When current list item is clicked, the current item details are displayed
    element.bind('click', function() {
      // Invoking the getItem function to set the current item details
      scope.$apply(attrs.showDetails);
      // Display the overlay
      toggleOverlay();
      // Defining the value to set the width of the options to and animate the main and options views to and from
      var width = calculateWidth(0.95);
      // Setting the height of the options window based on the greater of the heights between the main view and the window
      setHeight($('.detailsView'));
      // Animating the details view
      $('.detailsView').css('right', -width);
      $('.detailsView').css('width', width);
      $('.detailsView').animate({ 'right': '0' });
    });
  }
});

angular.module('oneListApp').directive('back', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // Hiding the overlay
      toggleOverlay();
      // Hiding the details view
      hideDetails();
    });
  }
});

angular.module('oneListApp').directive('hide', function() {
  return function(scope, element, attrs) {
    // Hiding the options or details view and displaying the main view when the overlay is clicked
    element.bind('click', function() {
      // Hiding the overlay
      toggleOverlay();
      // If main view isnt currently displayed, then the main view is displayed and the options view is hidden
      if($('mainView').css('left') != '0px') {
        var width = calculateWidth(0.8);
        $('.mainView').animate({ 'left': '0' });
        $('.optionsView').animate({ 'left': -width });
      }
      // If details view is currently displayed, then the details view is hidden
      if($('.detailsView').css('right') === '0px') {
        hideDetails();
      }
    });
  }
});

angular.module('oneListApp').directive('title', function() {
  return function(scope,element, attrs) {
    var populateField = function() {
      var val = attrs.placeholder;
      element.val(val);
    };
    // When the title input is clicked or focused on, the input field is filled with current title and the cursor goes to the end
    element.bind('focus', populateField);
    element.bind('click', populateField);
  }
});

angular.module('oneListApp').directive('editTitle', function() {
  return function(scope, element, attrs) {
    // When the edit title button is clicked, the edit title button is hidden and the change title input is displayed
    element.bind('click', function() {
      $('.changeTitle').css('height', '75px');
      $(this).fadeOut(200);
    });
  }
});

angular.module('oneListApp').directive('doneTitle', function() {
  return function(scope, element, attrs) {
    // Whne the done title button is clicked, the title is updated, the edit title button is displayed, and the change title input is hidden
    element.bind('click', function() {
      // The doneTitle function is invoked to update the title, and update the title on the current scope
      scope.$apply(attrs.doneTitle);

      // Hiding the change title input amd showing the edit title button
      $('.changeTitle').css('height', '0px');
      setTimeout(function() {
        $('.editTitle').fadeIn(200);
      }, 300);
    });
  }
});

angular.module('oneListApp').directive('addKeywords', function() {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      scope.$apply(attrs.addKeywords);
    });
  }
});

angular.module('oneListApp').directive('changePage', function() {
  return function(scope, element, attrs) {
    // When the change button is clicked the page switches to the opposite view
    element.bind('click', function() {
      // The overlay is hidden
      toggleOverlay();
      // When change page is clicked the options view is animated closed and then the new main view page is displayed
      var width = calculateWidth(0.8);
      $('.mainView').animate({ 'left': '0' });
      $('.optionsView').animate({ 'left': -width }, {'complete': function() {
          // The changePage function of the current scope is invoked to change the page
          scope.$apply(attrs.changePage);
        }
      });
    });
  }
});