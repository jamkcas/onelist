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
        var width = calculateWidth(0.95);
        $('.detailsView').animate({ 'right': -(width + 5) }, {'complete': function() {
            $('.changeTitle').css('height', '0px');
            $('.editTitle').fadeIn(200);
            $('.changeDueDate').css('height', '0px');
            $('.editDueDate').fadeIn(200);
            revertBackground();
          }
        });
      }
      // Invoking the clear scope function to clear the current item attribute on the current scope
      setTimeout(function() {
        scope.$apply(attrs.hide);
      }, 300);
    });
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

angular.module('oneListApp').directive('editNotes', function() {
  return function(scope, element, attrs) {
    var invertBackground = function() {
      element.css('background', '-webkit-radial-gradient(center, cover ellipse, #333333 0%, #333333 60%, #272822 100%)');
      element.css('color', 'white');
    };

    element.bind('click', invertBackground);
    element.bind('focus', invertBackground);
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

angular.module('oneListApp').directive('hideKeyword', function ($animate) {
  return function(scope, element, attrs) {
    element.bind('click', function() {
      // When the 'x' button is clicked for a keyword the keyword fades out
      $(this).parent().parent().css('opacity', '0');

      setTimeout(function() {
        // After 4/10 of a second, the delete keyword function is invoked to delete the current keyword
        scope.$apply(attrs.hideKeyword);
      }, 400);
    });
  }
});

angular.module('oneListApp').directive('editDuedate', function() {
  return function(scope, element, attrs) {
    // When the edit due_date button is clicked, the edit due_date button is hidden and the change due_date input is displayed
    element.bind('click', function() {
      $('.changeDueDate').css('height', '90px');
      $(this).fadeOut(200);
    });
  }
});

angular.module('oneListApp').directive('doneDuedate', function() {
  return function(scope, element, attrs) {
    // When the done due_date button is clicked, the due_date is updated, the edit due_date button is displayed, and the change due_date input is hidden
    element.bind('click', function() {
      // The addDueDate function is invoked to update the due_date, and update the due_date on the current scope
      scope.$apply(attrs.doneDuedate);

      // Hiding the change title input amd showing the edit title button
      $('.changeDueDate').css('height', '0px');
      setTimeout(function() {
        $('.editDueDate').fadeIn(200);
      }, 300);
    });
  }
});

angular.module('oneListApp').directive('searchItems', function() {
  return function(scope, element, attrs) {
    // When Search Item button is clicked the search item input is displayed and the add item input is hidden
    element.bind('click', function() {
      // Displaying the search overlay to prevent searchFilter buttons from being clicked
      $('.searchOverlay').css('height', $('.searchFilters').height());
      $('.searchOverlay').css('z-index', '200');
      // Hiding the add item input(if it is showing) and displaying the search item input
      if($('.addItem').css('visibility') === 'visible') {
        $('.addItem').animate({ 'height': '0px' }, { 'complete': function() {
            $('.addItem').css({ 'border-bottom': '0px' });
            $('.searchWindow').css({ 'border-bottom': '1px solid black' });
            $('.searchWindow').animate({ 'height': '78px' });
          }
        });
      } else {
        $('.searchWindow').css({ 'border-bottom': '1px solid black' });
        $('.searchWindow').animate({ 'height': '78px' });
      }
      // Hiding the filter labels title text
      $('.searchLabels p').css('opacity', '0');
    });
  }
});

angular.module('oneListApp').directive('doneSearching', function() {
  return function(scope, element, attrs) {
    // When x button is clicked the add item input is displayed and the search item input is hidden
    element.bind('click', function() {
      $('.searchOverlay').css('z-index', '-100');
      // Hiding the search item input and displaying the add item input
      $('.searchWindow').animate({ 'height': '0px' }, { 'complete': function() {
          $('.searchWindow').css({ 'border-bottom': '0px' });
          $('.addItem').css({ 'border-bottom': '1px solid black' });
          $('.addItem').animate({ 'height': '78px' });
          // Invoking the done searching function on current scope to clear the search filter results
          scope.$apply(attrs.doneSearching);
        }
      });
      // Displaying the filter labels title text
      $('.searchLabels p').css('opacity', '1');
    });
  }
});

angular.module('oneListApp').directive('filterLabels', function() {
  return function(scope, element, attrs) {
    // When filter label button is clicked the filter label input is displayed and the add item input is hidden
    element.bind('click', function() {
      // Displaying the search overlay to prevent searchFilter buttons from being clicked
      $('.searchOverlay').css('height', $('.searchFilters').height());
      $('.searchOverlay').css('z-index', '200');
      // Hiding the add item input(if it is being displayed) and displaying the filter label input
      if($('.addItem').css('visibility') === 'visible') {
        $('.addItem').animate({ 'height': '0px' }, { 'complete': function() {
            $('.addItem').css({ 'border-bottom': '0px' });
            $('.filterWindow').css({ 'border-bottom': '1px solid black' });
            $('.filterWindow').animate({ 'height': '78px' });
          }
        });
      } else {
        $('.filterWindow').css({ 'border-bottom': '1px solid black' });
        $('.filterWindow').animate({ 'height': '78px' });
      }
      // Hiding the search items title text
      $('.searchItems p').css('opacity', '0');
    });
  }
});

angular.module('oneListApp').directive('doneFiltering', function() {
  return function(scope, element, attrs) {
    // When x button is clicked the add item input is displayed and the filter label input is hidden
    element.bind('click', function() {
      $('.searchOverlay').css('z-index', '-100');
      // Hiding the filter label input and displaying the add item input
      $('.filterWindow').animate({ 'height': '0px' }, { 'complete': function() {
          $('.filterWindow').css({ 'border-bottom': '0px' });
          $('.addItem').css({ 'border-bottom': '1px solid black' });
          $('.addItem').animate({ 'height': '78px' });
          // Invoking the done searching function on current scope to clear the filter label results
          scope.$apply(attrs.doneFiltering);
        }
      });
      // Displaying the search items title text
      $('.searchItems p').css('opacity', '1');
    });
  }
});
